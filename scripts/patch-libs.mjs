/**
 * Post-build script: Fixes bare module imports in Nitro's generated _libs chunks.
 * Nitro bundles tslib into _libs/tslib.mjs but leaves `import { ... } from "tslib"`
 * in other chunks (like react-remove-scroll.mjs), causing ERR_MODULE_NOT_FOUND on Vercel.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const libDirs = [
  resolve(__dirname, "../.output/server/_libs"),
  resolve(__dirname, "../.vercel/output/functions/__server.func/_libs"),
];

for (const dir of libDirs) {
  if (!existsSync(dir)) continue;

  const files = readdirSync(dir).filter(f => f.endsWith(".mjs") && f !== "tslib.mjs");
  
  let patchedCount = 0;
  for (const file of files) {
    const filePath = join(dir, file);
    let content = readFileSync(filePath, "utf-8");
    
    // Replace `from "tslib"` with `from "./tslib.mjs"`
    if (content.includes('from "tslib"') || content.includes("from 'tslib'")) {
      content = content.replace(/from\s+["']tslib["']/g, 'from "./tslib.mjs"');
      writeFileSync(filePath, content, "utf-8");
      patchedCount++;
    }
  }
  console.log(`✅ Patched ${patchedCount} files in ${dir}`);
}

console.log("✅ patch-libs complete.");
