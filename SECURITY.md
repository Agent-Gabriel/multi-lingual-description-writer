# Security and Hardening Policy (Production Ready)

This document outlines the security checks, hardening measures, and defensive configurations implemented in the application backend (`server.ts`) prior to production deployment.

## 🛡️ Security Headers & Information Disclosure
- **Helmet Security Integration**: Configured HTTP response headers using `helmet`. 
  - To ensure seamless integration within the Google AI Studio sandbox iframe, `contentSecurityPolicy` and `frameguard` are disabled specifically for the preview environment.
  - All other robust headers (such as `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Strict-Transport-Security` (HSTS), and `Referrer-Policy`) are fully enabled to protect against common web-based attacks.
- **Fingerprint Mitigation**: Explicitly disabled the standard `X-Powered-By` response header using `app.disable("x-powered-by")` to prevent automated scanners from fingerprinting Express/Node.js backend technologies.

## 🚦 Rate Limiting & Denial of Service (DoS) Prevention
- **IP-Based Rate Limiting**: Integrated `express-rate-limit` to protect high-resource API routes and secure upstream Gemini API quota limits:
  - **Business Search Endpoint (`/api/search-business`)**: Limited to **50 requests per 15 minutes** per IP.
  - **Description Generation Endpoint (`/api/generate`)**: Limited to **25 requests per 15 minutes** per IP.
- **Payload Size Control**: Restricted incoming JSON payloads to **15kb** via `express.json({ limit: "15kb" })`. This safeguards the JSON parser and Node.js process from memory bloat and Denial of Service (DoS) attacks caused by excessively large request payloads.

## 🧹 Request Validation, Type Safety & Sanitization
- **Strict Data Type Checks**: Implemented rigorous validation for all API entry points, ensuring properties have safe types before processing.
- **Payload String Constraints**: Set strict maximum character boundaries:
  - Queries, Business Names, Keywords, and Districts: **Maximum 150 characters**.
  - Service Bullet Points: **Maximum 1,500 characters**.
  - Any request exceeding these limits or passing non-string values is rejected with a clear `400 Bad Request` status before hitting downstream logic.
- **Whitespace Sanitization**: All input properties are trimmed and cleaned before constructing Gemini model prompts to prevent potential prompt injection or unintended whitespace payload bloating.
