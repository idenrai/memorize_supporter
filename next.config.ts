import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/sample-decks": ["./input/public/**/*"],
    "/api/sample-decks/[deckId]": ["./input/public/**/*"],
    "/[lang]": ["./input/public/**/*"],
  },
};

export default nextConfig;
