/**
 * audit-i18n.cjs
 * Verifies key parity across ko.ts, en.ts, and ja.ts in Memorize Supporter
 */

const fs = require("fs");
const path = require("path");

const I18N_DIR = path.resolve(__dirname, "../../../../src/i18n");

console.log("==================================================");
console.log("🌐 [i18n Audit] Verifying locale key parity (ko/en/ja)...");
console.log("==================================================");

function getKeys(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, "utf-8");
  const keys = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const m = line.match(/^\s*([a-zA-Z0-9_]+)\s*:/);
    if (m && !["import", "export", "const", "return"].includes(m[1])) {
      keys.push(m[1]);
    }
  }
  return [...new Set(keys)].sort();
}

const koKeys = getKeys(path.join(I18N_DIR, "ko.ts"));
let hasError = false;

for (const lang of ["en", "ja"]) {
  const targetKeys = getKeys(path.join(I18N_DIR, `${lang}.ts`));
  const missingInTarget = koKeys.filter((k) => !targetKeys.includes(k));
  const extraInTarget = targetKeys.filter((k) => !koKeys.includes(k));

  if (missingInTarget.length > 0 || extraInTarget.length > 0) {
    hasError = true;
    console.error(`❌ Mismatch found between ko.ts and ${lang}.ts:`);
    if (missingInTarget.length > 0) {
      console.error(`   Missing in ${lang}.ts:`, missingInTarget);
    }
    if (extraInTarget.length > 0) {
      console.error(`   Extra in ${lang}.ts:`, extraInTarget);
    }
  } else {
    console.log(`✅ ${lang}.ts is in 100% parity with ko.ts (${koKeys.length} keys)`);
  }
}

console.log("==================================================");
if (!hasError) {
  console.log(`🎉 [i18n Audit] All 3 locale files are perfectly in sync! (${koKeys.length} keys total)`);
  process.exit(0);
} else {
  console.error("⚠️  [i18n Audit] Mismatches detected. Please fix missing keys.");
  process.exit(1);
}

