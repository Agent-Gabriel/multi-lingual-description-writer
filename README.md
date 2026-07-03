# 🗺️ Bilingual Map Description Maker (เครื่องมือช่วยเขียนคำอธิบายหมุดร้านค้าสองภาษา)

Welcome to the **Bilingual Map Description Maker**! This is a free, user-friendly, and open-source tool designed specifically to help small business owners (especially in Thailand and across Southeast Asia) craft perfectly optimized, dual-language (Thai & English) descriptions for their Google Business Profile / Google Maps listings.

This project represents a practical experiment in using **Google AI Studio** and **Gemini 3.5 Flash** to solve real-world localized SEO problems for local merchants—combining powerful live search grounding with high-quality bilingual copywriting.

---

## ✨ Features

- **🔍 Live Google Search Grounding:** Powered by Gemini's Search Grounding, type in your shop name and the app will retrieve real, up-to-date business categories, district locations, and key service details from Google.
- **🇹🇭🇬🇧 Optimized Bilingual Copywriting:** Automatically generates 3 professional description variations. Each variation features polite Central Thai copy optimized for Local SEO search algorithms in the first 250 characters, followed by a polished, engaging English translation.
- **📍 Precise District/Amphoe Target Mapping:** Select or specify exact, localized area modifiers (e.g. *ทองหล่อ, กรุงเทพฯ / Thonglor, Bangkok*, *นิมมาน, เชียงใหม่ / Nimman, Chiang Mai*) to boost map rankings.
- **📝 Live Copy Editing & Dynamic Verification:** Verify character length constraints dynamically (ensuring descriptions fit perfectly under Google's 750-character limit) and edit before copying.
- **📄 Pro Export Options:** Instant clipboard copy or beautiful PDF download of your customized Google Maps descriptions using client-side layout generation.
- **🛡️ Rate-Limited & Hardened Server:** Enterprise-grade security headers using Helmet, strict CORS/CSP configurations, and robust IP-based rate limiting to prevent API quota abuse.

---

## 🛠️ Technology Stack (English Version)

### Frontend
- **React 19 & TypeScript:** State-of-the-art declarative UI with strict type safety.
- **Tailwind CSS v4:** Advanced CSS utilities integrated into the Vite pipeline for a highly polished, responsive design.
- **Motion (motion/react):** Fluid, high-performance animations and transitions.
- **Lucide React:** A complete set of clean, modern vector icons.
- **html2canvas & jsPDF:** Client-side screenshot and vector PDF generation for quick asset saving.

### Backend & AI Engine
- **Node.js & Express:** Lightweight, high-performance API server.
- **tsx & esbuild:** TypeScript native execution in development and lightning-fast CommonJS bundling for production.
- **Google Gen AI SDK (`@google/genai`):** Modern SDK interface utilized to harness **Gemini 3.5 Flash** with search grounding tools.
- **JSON Scheme Correction Engine:** Two-stage error-resilient recovery model in `server.ts` that corrects JSON syntax anomalies in real-time, preventing crashes from model output formatting.
- **Express Rate Limit & Helmet:** Secures application endpoints and client security context.

---

## 🌏 เทคโนโลยีและคู่มือการเริ่มใช้งาน (Asian / Thai Version)

นี่คือโครงสร้างทางเทคโนโลยีและคู่มือการติดตั้งใช้งานสำหรับเจ้าของธุรกิจและนักพัฒนาในเอเชียตะวันออกเฉียงใต้

### ระบบเทคโนโลยี (Tech Stack)
- **หน้าบ้าน (Frontend):** พัฒนาด้วย **React 19** ร่วมกับ **TypeScript** เพื่อการจัดการสถานะและชนิดข้อมูลที่ปลอดภัย ตกแต่งด้วย **Tailwind CSS v4** และแอนิเมชันที่ลื่นไหลจากไลบรารี **Motion**
- **หลังบ้าน (Backend):** ทำงานบน **Express** และ **Node.js** รันและมัดไฟล์อย่างรวดเร็วด้วย **esbuild** และปลอดภัยด้วยการป้องกัน DDoS จาก **Rate Limiter**
- **สมองกล AI (AI Engine):** เชื่อมต่อโดยตรงกับโมเดล **Gemini 3.5 Flash** ผ่าน **Google Gen AI SDK** พร้อมติดตั้ง **Search Grounding** เพื่อดึงข้อมูลหมุดร้านค้าจากแผนที่จริงได้แบบเรียลไทม์ และระบบแก้ไวยากรณ์ JSON อัตโนมัติป้องกันข้อผิดพลาด

---

## 🚀 Quick Start / คู่มือการติดตั้งและเปิดใช้งาน

### Prerequisites / สิ่งที่ต้องมีก่อนเริ่มใช้งาน
- **Node.js** (v18 or higher recommended)
- **Gemini API Key** (Get a free key from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository / ดาวน์โหลดโปรเจกต์
```bash
git clone https://github.com/your-username/bilingual-map-description-maker.git
cd bilingual-map-description-maker
```

### 2. Install Dependencies / ติดตั้งโมดูลเสริม
```bash
npm install
```

### 3. Setup Environment Variables / ตั้งค่าตัวแปรระบบ
Create a `.env` file in the root directory by copying the `.env.example` file:
```bash
cp .env.example .env
```
Open `.env` and fill in your Gemini API Key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 4. Run Development Server / เปิดใช้งานโหมดพัฒนา
```bash
npm run dev
```
The application will boot up at [http://localhost:3000](http://localhost:3000). Open this link in your browser to test it.

### 5. Production Build / รวบรวมเพื่อใช้งานจริง
To build the app and run it in a containerized or production-ready format:
```bash
npm run build
npm start
```

---

## ⚙️ Project Architecture & How It Works

1. **User Input / Search:** The user types a business name (e.g., *"Roots Sathorn"*).
2. **Search Grounding Api Endpoint (`/api/search-business`):** Express receives the query, invokes the `@google/genai` client, instructs Gemini with the `googleSearch` tool, retrieves the actual location and core features, and returns JSON.
3. **Drafting SEO Descriptions (`/api/generate`):**
   - Incorporates the targeted English and Thai district names.
   - Embeds SEO core keywords in the front of both descriptions.
   - Enforces strict layout rules (polite Central Thai with Ka/Krap, dual line breaks, and professional English).
4. **Self-Healing Parsing Pipeline:** If Gemini's JSON contains extraneous markdown, search annotations, or trailing characters, `parseAndFixJson` automatically triggers an ultra-fast corrector call to standardise the schema before serving it to the client.

---

## 🛡️ Security, Auditing & Dependency Checks (ตรวจสอบความปลอดภัยก่อนเผยแพร่จริง)

Before publishing or hosting this application publicly, we recommend performing the following security audits and checks to ensure your project, users, and API quotas remain completely safe:

### 1. Zero Secret Leaks on the Client-side (การรักษาความลับฝั่งเบราว์เซอร์)
- **Status: Safe by Design.** The application uses a robust full-stack architecture. Your sensitive `GEMINI_API_KEY` is loaded strictly server-side on Node.js/Express (`server.ts`). It is **never** exposed to the frontend/browser.
- **Auditing with Google DevTools:** 
  1. Open the application in your browser.
  2. Press `F12` or right-click and select **Inspect** to open Google Chrome Developer Tools.
  3. Navigate to the **Network** tab, trigger a description generation, and inspect the HTTP payloads for `/api/generate`. You will see that only clean inputs and outputs are exchanged—no API keys or credentials are leaked in headers or response bodies.
  4. Navigate to the **Console** tab and verify no sensitive runtime environment details or raw API payloads are printed.

### 2. Dependency Locking & Version Integrity (การล็อกเวอร์ชันของโมดูล)
- **Status: Configured.** The project includes a complete `package-lock.json` file. This locks down all exact sub-dependency trees, preventing "dependency drift" or unexpected code execution when deploying to Cloud Run, Vercel, or other hosts.
- **Audit Steps:**
  - Avoid deleting `package-lock.json`. Always run `npm ci` (Clean Install) instead of `npm install` in your deployment CI/CD pipelines to guarantee identical production builds.
  - To scan the dependency tree for known vulnerabilities, run the following command in your terminal before publishing:
    ```bash
    npm audit
    ```

### 3. API Quota Abuse & Rate Limiting (การป้องกันการส่งคำขอถี่เกินไป)
- **Status: Pre-Configured.** The server uses `express-rate-limit` to restrict clients to **15 requests per 15 minutes** per IP address on the generation endpoints. This protects your Google AI Studio quota from automated scraping bots or excessive manual abuse.
- **Audit Steps:** Adjust the limit values in `server.ts` according to your target production needs and Gemini API tier limits.

### 4. HTTP Headers Security (ระบบป้องกันภัยคุกคามทางเว็บ)
- **Status: Configured.** **Helmet.js** is pre-configured on Express to set safe HTTP headers (CSP, XSS Protection, Frameguard, etc.).
- **Audit Steps:** If embedding the tool inside an external CMS or iframe, configure Helmet's `frameguard` or `contentSecurityPolicy` directive accordingly.

---

## 🤝 Contributing

We welcome contributions from small business advocates, local SEO specialists, and developers! Feel free to:
- Open issues for language localization improvements.
- Submit Pull Requests to add more area suggestions or translation mappings.
- Help make this tool more accessible to local merchants across Asia.

*This project is an open-source experiment utilizing the Google AI Studio developer ecosystem.*
