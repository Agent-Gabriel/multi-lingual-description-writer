import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

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

  try {
    return JSON.parse(cleaned) as T;
  } catch (parseError: any) {
    console.warn("Initial JSON parse failed. Triggering fast Gemini fallback corrector. Error:", parseError.message);
    console.warn("Raw text attempted to parse:", responseText);

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
      return JSON.parse(fixCleaned) as T;
    } catch (fallbackError: any) {
      console.error("Fast JSON corrector also failed:", fallbackError);
      return defaultValue;
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/search-business", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const prompt = `
Search for the business: "${query}" in Thailand.
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
          systemInstruction: "You are a local SEO data retriever. You MUST return exactly the JSON format requested containing real, grounded details of the business in Thailand.",
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
        { name: query, district: "Thonglor, Bangkok", coreKeyword: "", bullets: [] }
      );
      res.json(data);
    } catch (error: any) {
      console.error("Search error:", error);
      const isQuota = error.message && (error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("quota"));
      const errMsg = isQuota 
        ? "Gemini API rate limit exceeded. Since grounding utilizes live Google Maps and Search, requests are highly rate-limited on the free tier. Please wait a minute or input your business details manually."
        : (error.message || "Failed to find business info");
      res.status(500).json({ error: errMsg });
    }
  });

  app.post("/api/generate", async (req, res) => {
    try {
      const { businessName, bulletPoints, coreKeyword, district } = req.body;

      if (!bulletPoints || !coreKeyword || !district) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const prompt = `
Generate 3 distinct variations of a Google Business Profile (GBP) description for a business in Thailand.
Business Name/Location (use this to ground your knowledge using Google Maps and Google Search for up-to-date, accurate details about this business): ${businessName || 'Unknown'}

Raw Service Bullet Points:
${bulletPoints}

Target Core Keyword: ${coreKeyword}
Target Location/Area/District: ${district}

Strict Layout Requirements per variation:
1. Thai Section First: Polite Central Thai (using Khun, Ka/Krap), seamlessly integrating the core keyword and region modifier (${district}) within the first 250 characters where search algorithms favor them.
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
        ? "Gemini API rate limit exceeded. Since grounding utilizes live Google Maps and Search, requests are highly rate-limited on the free tier. Please wait a minute before generating again."
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
