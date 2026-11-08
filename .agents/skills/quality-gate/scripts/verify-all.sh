#!/bin/bash
# Quality Gate: Full Pipeline Check for Memorize Supporter
# Runs Node version check, TypeScript, ESLint, i18n parity, Node tests, and Next.js build.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
cd "$PROJECT_ROOT"

echo "=================================================="
echo "🚀 [Quality Gate] Starting Next.js Pipeline Check..."
echo "   Root: $PROJECT_ROOT"
echo "=================================================="

# 1. Node Version Check
echo "🔍 Step 1: Checking Node environment..."
npm run check:node
echo "✅ Step 1 Passed"

# 2. TypeScript Static Type Check
echo "🔍 Step 2: Checking TypeScript types (npm run type-check)..."
npm run type-check
echo "✅ Step 2 Passed: 0 Type Errors"

# 3. ESLint Check
echo "🔍 Step 3: Running ESLint (npm run lint)..."
npm run lint
echo "✅ Step 3 Passed: 0 Lint Errors"

# 4. i18n Parity Audit
if [ -f "./.agents/skills/i18n/scripts/audit-i18n.sh" ]; then
    echo "🔍 Step 4: Auditing i18n key parity (ko/en/ja)..."
    bash ./.agents/skills/i18n/scripts/audit-i18n.sh
    echo "✅ Step 4 Passed: 3 Locales in Sync"
fi

# 5. Tests
if grep -q '"test"' package.json 2>/dev/null; then
    echo "🔍 Step 5: Running Tests (npm run test)..."
    npm run test
    echo "✅ Step 5 Passed: All tests passed"
fi

# 6. Production Build
echo "🔍 Step 6: Running Next.js Production Build (npm run build)..."
npm run build
echo "✅ Step 6 Passed: Production Build Succeeded"

echo "=================================================="
echo "🎉 [Quality Gate] All checks passed successfully!"
echo "=================================================="

