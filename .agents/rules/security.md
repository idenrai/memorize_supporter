---
applyTo: "**"
---

# Security Standards

This project is a **privacy-first, Local-First** study application. All user study data (flashcards, custom decks, study progress, and exam score histories) is stored in client-side storage (`IndexedDB`) only — it is never transmitted to or persisted on any server.

## Data Privacy & Client-First Isolation (by design)

- **Zero-Server Database**: Never add server-side persistent databases (Prisma, SQLite, PostgreSQL, etc.) or API endpoints that accept, store, or log user study data.
- **Client Storage Boundary**: User decks, cards, progress, and exam history must strictly remain within the browser's `IndexedDB` (`src/lib/client-db.ts`).
- If a future feature would require transmitting study notes, custom decks, or exam records off-device, raise it for explicit user review before implementing.

## API Keys and Secrets

- Never hardcode API keys, tokens, or credentials in source files (including `.env.example`).
- Secrets needed at runtime must be accessed via environment variables only.
- Vercel Function environment variables must be configured in the Vercel dashboard, not committed to the repository.

## Input Validation (OWASP A03 — Injection)

- **Zero-Trust Boundary Validation**: Validate and sanitize all external inputs at system boundaries: uploaded JSON deck files, form fields, and URL query parameters.
- All imported deck payloads must pass runtime Zod validation (`src/lib/card-parser.ts`, `src/schemas/deck.ts`) before being written to IndexedDB.
- When building URLs dynamically, use `URL` / `URLSearchParams` constructors — never unsafe string concatenation.
- Never use `dangerouslySetInnerHTML` without explicit sanitization.

## Dependency Safety (OWASP A06 — Vulnerable Components)

- Prefer well-maintained, widely used packages. Avoid packages with no recent commits or very few downloads.
- Run `npm audit` periodically and address high/critical vulnerabilities before merging.
- Pin GitHub Actions to immutable SHA hashes in `.github/workflows/` (already enforced in `ci.yml`).

## Next.js API Routes & Server Actions

- Serverless Route Handlers in `src/app/api/` act strictly as read-only static sample deck providers (`/api/sample-decks`) — they must never accept arbitrary user data to store on the server.
- Server Actions (`src/actions/`) are restricted to stateless system utilities (such as `setLanguageCookie` for locale cookies).
- Always validate request parameters with Zod before processing.

## Content Security

- Do not use `eval()`, `new Function()`, or dynamic `import()` with user-supplied strings.
- Validate and sanitize custom JSON imports to prevent Prototype Pollution (`__proto__`, `constructor`).
- Avoid `window.location = userInput` — always validate redirect targets against an internal route allowlist.

