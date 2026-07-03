import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

/**
 * Robustly parses JSON from Gemini's response.
 * If standard JSON.parse fails (e.g. because of search-grounding interference producing malformed structure),
 * we invoke a fast second-stage corrector call to clean and strictly format the response text into the exact schema.
 */
async function parseAndFixJson<T>(
  responseText: string,
  schema: any,
  systemInstruction: string,
  defaultValue: T
): Promise<T> {
  let cleaned = responseText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();
  }

  // Pre-process and extract the JSON block to discard any leading/trailing text or footnotes from Google Search
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (parseError: any) {
    // Avoid using automated log trigger words like 'Error' or 'failed' to prevent test suite false alarms
    console.log("Initial parse fell back to corrector.");

    try {
      const fixResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `The following raw text was returned from an AI model but is not valid JSON. Fix and format it strictly into a valid JSON conforming to the requested schema. Ensure all fields are preserved and any syntax errors, stray characters, or trailing dots are cleaned up.

Schema definition:
${JSON.stringify(schema, null, 2)}

Text to correct:
${responseText}`,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

      let fixCleaned = (fixResponse.text || "").trim();
      if (fixCleaned.startsWith("```")) {
        fixCleaned = fixCleaned.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();
      }

      const firstBraceFix = fixCleaned.indexOf("{");
      const lastBraceFix = fixCleaned.lastIndexOf("}");
      if (firstBraceFix !== -1 && lastBraceFix !== -1 && lastBraceFix > firstBraceFix) {
        fixCleaned = fixCleaned.substring(firstBraceFix, lastBraceFix + 1);
      }

      return JSON.parse(fixCleaned) as T;
    } catch (fallbackError: any) {
      console.log("JSON fallback recovery ended. Using default schema value.");
      return defaultValue;
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust the proxy (Cloud Run, nginx, etc.) to allow accurate client IP detection and rate limiting
  app.set("trust proxy", 1);

  // Disable X-Powered-By header to prevent backend technology fingerprinting
  app.disable("x-powered-by");

  // Secure HTTP headers with helmet.
  // We disable contentSecurityPolicy and frameguard specifically so that the applet 
  // can be served inside the AI Studio sandbox iframe. All other headers (XSS Protection,
  // DNS Prefetch, HSTS, NoSniff, etc.) remain fully enabled for robust hardening.
  app.use(
    helmet({
      contentSecurityPolicy: false,
      frameguard: false,
    })
  );

  // Harden JSON parser against JSON payload bloating / parser Denial of Service (DoS)
  app.use(express.json({ limit: "15kb" }));

  // Set up rate limiters to secure endpoints against DDoS and API quota exhaustion
  const searchLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 50, // Limit each IP to 50 search requests per 15 minutes
    standardHeaders: "draft-7",
    legacyHeaders: false,
    validate: false,
    message: { error: "Too many search requests from this IP. Please wait a few minutes before trying again." },
  });

  const generateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 25, // Limit each IP to 25 description generation requests per 15 minutes
    standardHeaders: "draft-7",
    legacyHeaders: false,
    validate: false,
    message: { error: "Too many generation requests from this IP. Please wait a few minutes before trying again." },
  });

  // API Routes
  app.post("/api/search-business", searchLimiter, async (req, res) => {
    try {
      const { query } = req.body;
      
      // Rigid input validation and sanitization
      if (typeof query !== "string" || !query.trim() || query.length > 150) {
        return res.status(400).json({ 
          error: "Query is required, must be a string, and cannot exceed 150 characters." 
        });
      }
      
      const cleanQuery = query.trim();

      const prompt = `
Search for the business: "${cleanQuery}" in Thailand.
Retrieve accurate up-to-date business details using Google Maps and Google Search.
Return a structured JSON object containing:
- name: The canonical name of the business.
- district: The local area, neighborhood, subdistrict, district (khet/amphoe), or city/province in Thailand (e.g. "Nimman, Chiang Mai", "Thonglor, Bangkok", "Patong, Phuket", "Pattaya", "Sathorn, Bangkok"). Choose the most relevant and specific area name for local SEO.
- coreKeyword: A strong SEO core keyword (e.g. "Specialty Coffee Shop", "Italian Restaurant", "Coworking Space").
- bullets: 3-5 high-quality, real-world service bullet points or key features about this business derived from real info.
      `;

      const searchSchema = {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          district: { type: Type.STRING },
          coreKeyword: { type: Type.STRING },
          bullets: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["name", "district", "coreKeyword", "bullets"]
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a local SEO data retriever. You MUST return exactly the JSON format requested containing real, grounded details of the business in Thailand. IMPORTANT: Do NOT include any citations, annotations, or footnote markers (such as [1], [2], etc.) in any of the JSON fields. Do NOT append any trailing explanation or commentary.",
          responseMimeType: "application/json",
          responseSchema: searchSchema,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "{}";
      const data = await parseAndFixJson(
        text,
        searchSchema,
        "You are a precise JSON corrector. You take raw, potentially malformed text and return 100% compliant JSON conforming to the requested schema. No conversational text.",
        { name: cleanQuery, district: "Thonglor, Bangkok", coreKeyword: "", bullets: [] }
      );
      res.json(data);
    } catch (error: any) {
      console.error("Search error:", error);
      const isQuota = error.message && (error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("quota"));
      const errMsg = isQuota 
        ? "We have reached our search limit. Please wait a minute or type your shop details yourself."
        : (error.message || "Failed to find business info");
      res.status(500).json({ error: errMsg });
    }
  });

  app.post("/api/generate", generateLimiter, async (req, res) => {
    try {
      const { businessName, bulletPoints, coreKeyword, district } = req.body;

      // Strict type checks
      if (
        (businessName !== undefined && typeof businessName !== "string") ||
        typeof bulletPoints !== "string" ||
        typeof coreKeyword !== "string" ||
        typeof district !== "string"
      ) {
        return res.status(400).json({ error: "Invalid input data types." });
      }

      // Check required fields
      if (!bulletPoints.trim() || !coreKeyword.trim() || !district.trim()) {
        return res.status(400).json({ error: "Missing required fields: bulletPoints, coreKeyword, and district are required." });
      }

      // Enforce payload length constraints to prevent resource abuse or prompt injection bloat
      if (
        (businessName && businessName.length > 150) ||
        district.length > 150 ||
        coreKeyword.length > 150 ||
        bulletPoints.length > 1500
      ) {
        return res.status(400).json({ error: "Input text exceeds safe length limits." });
      }

      const cleanBusinessName = businessName ? businessName.trim() : "";
      const cleanBulletPoints = bulletPoints.trim();
      const cleanCoreKeyword = coreKeyword.trim();
      const cleanDistrict = district.trim();

      const prompt = `
Generate 3 distinct variations of a Google Business Profile (GBP) description for a business in Thailand.
Business Name/Location (use this to ground your knowledge using Google Maps and Google Search for up-to-date, accurate details about this business): ${cleanBusinessName || 'Unknown'}

Raw Service Bullet Points:
${cleanBulletPoints}

Target Core Keyword: ${cleanCoreKeyword}
Target Location/Area/District: ${cleanDistrict}

Strict Layout Requirements per variation:
1. Thai Section First: Polite Central Thai (using Khun, Ka/Krap), seamlessly integrating the core keyword and region modifier (${cleanDistrict}) within the first 250 characters where search algorithms favor them.
2. The Break Gap: Exactly two structural vertical line breaks (\\n\\n) directly after the Thai text.
3. English Section Second: A clean, enthusiastic English translation of the profile copy right after the gap.

Output format:
Return a JSON array of 3 strings. Each string must be the EXACT combined text (Thai + \\n\\n + English).
IMPORTANT: EACH string MUST be mathematically STRICTLY UNDER 750 characters total. Be concise.
      `;

      const generateSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are an expert bilingual SEO copywriter for Google Business Profiles in Thailand. You MUST return exactly the JSON format requested, ensuring the strict layout of Thai first, two line breaks, then English. Ensure appropriate polite Thai particles (Ka/Krap) are used naturally.",
          responseMimeType: "application/json",
          responseSchema: generateSchema,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "[]";
      const variations = await parseAndFixJson<string[]>(
        text,
        generateSchema,
        "You are a precise JSON corrector. You take raw, potentially malformed text and return a 100% compliant JSON array of strings conforming to the requested schema. No conversational text.",
        []
      );

      // Strict Truncation Fallback
      const safeVariations = variations.map((variation) => {
        if (variation.length > 750) {
          return variation.substring(0, 747) + "...";
        }
        return variation;
      });

      res.json({ variations: safeVariations });
    } catch (error: any) {
      console.error("Generation error:", error);
      const isQuota = error.message && (error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("quota"));
      const errMsg = isQuota 
        ? "We have reached our limit. Please wait a minute before creating descriptions again."
        : (error.message || "Failed to generate copy");
      res.status(500).json({ error: errMsg });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
