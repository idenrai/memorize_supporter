---
applyTo: "**"
---

# Security Standards

This project is a **privacy-first** portfolio app. All user financial data is stored in `localStorage` only — it is never sent to any server. Market data is fetched client-side via proxies.

## Data Privacy (by design)

- Never add server-side storage, database calls, or API endpoints that accept user portfolio data.
- If a feature would require transmitting holdings or transaction data off-device, raise it for explicit review before implementing.
- When using `localStorage`, store only the minimum required data. Never persist sensitive tokens or credentials.

## API Keys and Secrets

- Never hardcode API keys, tokens, or credentials in source files (including `.env.example`).
- Secrets needed at runtime (e.g., `GOOGLE_CLIENT_ID`) must be accessed via environment variables only.
- Vercel Function environment variables must be configured in the Vercel dashboard, not committed to the repository.

## Input Validation (OWASP A03 — Injection)

- Validate and sanitise all external inputs at system boundaries: form fields, CSV imports, URL query parameters.
- When building URLs dynamically, use `URL` / `URLSearchParams` constructors — never string concatenation.
- Never use `dangerouslySetInnerHTML` without explicit sanitisation.

## Dependency Safety (OWASP A06 — Vulnerable Components)

- Prefer well-maintained, widely used packages. Avoid packages with no recent commits or very few downloads.
- Run `npm audit` periodically and address high/critical vulnerabilities before merging.
- Pin GitHub Actions to immutable SHA hashes in `.github/workflows/` (already enforced in `ci.yml`).

## Vercel API Routes

- Vercel Serverless Functions in `api/` act as proxies only — they must not accept arbitrary user data and forward it onward.
- Set `Cache-Control` headers appropriately; do not cache responses that include user-specific data.
- Validate the `origin` or use CORS headers to restrict which domains can call the proxy functions.

## Content Security

- Do not use `eval()`, `new Function()`, or dynamic `import()` with user-supplied strings.
- All external URLs (Yahoo Finance, FRED, Google APIs) must be explicitly allowed and documented.
- Avoid `window.location = userInput` — always validate redirect targets against an allowlist.
