/**
 * Post-build script: Fixes bare module imports in Nitro's generated server chunks.
 * Nitro bundles tslib into _libs/tslib.mjs but leaves `import "tslib"` or 
 * `import { ... } from "tslib"` in other chunks, causing ERR_MODULE_NOT_FOUND on Vercel.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "fs";
import { resolve, dirname, join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const targetDirs = [
  resolve(__dirname, "../.output/server"),
  resolve(__dirname, "../.vercel/output/functions/__server.func"),
];

function patchDir(baseDir) {
  if (!existsSync(baseDir)) return;

  const tslibPath = join(baseDir, "_libs", "tslib.mjs");
  if (!existsSync(tslibPath)) {
    console.warn(`⚠️ tslib.mjs not found in ${join(baseDir, "_libs")}. Skipping.`);
    return;
  }

  let patchedCount = 0;

  function walk(dir) {
    const files = readdirSync(dir);
    for (const file of files) {
      if (file === "node_modules") continue; // Skip node_modules entirely
      
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (stat.isFile() && filePath.endsWith(".mjs") && file !== "tslib.mjs") {
        let content = readFileSync(filePath, "utf-8");
        
        // Check for any tslib import
        if (content.includes('from "tslib"') || content.includes("from 'tslib'") || content.includes('import "tslib"') || content.includes("import 'tslib'")) {
          // Calculate relative path from current file to tslib.mjs
          let relPath = relative(dirname(filePath), tslibPath);
          if (!relPath.startsWith(".")) relPath = "./" + relPath;
          
          content = content.replace(/from\s+["']tslib["']/g, `from "${relPath}"`);
          content = content.replace(/import\s+["']tslib["']/g, `import "${relPath}"`);
          
          writeFileSync(filePath, content, "utf-8");
          patchedCount++;
        }
      }
    }
  }

  walk(baseDir);
  console.log(`✅ Patched ${patchedCount} files in ${baseDir}`);
}

for (const dir of targetDirs) {
  patchDir(dir);
}

console.log("✅ patch-libs complete.");
