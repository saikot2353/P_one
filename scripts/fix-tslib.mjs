/**
 * Post-build script: injects real tslib ESM exports into the empty stub
 * that Nitro generates at _libs/tslib.mjs so Vercel serverless can resolve it.
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Resolve the real tslib ESM file
const tslibPkg = resolve(__dirname, "../node_modules/tslib");
const tslibEsmPath = resolve(tslibPkg, "tslib.es6.mjs");

if (!existsSync(tslibEsmPath)) {
  console.error("❌ Could not find tslib ESM at:", tslibEsmPath);
  process.exit(1);
}

const tslibContent = readFileSync(tslibEsmPath, "utf-8");

// Targets: both the node-server and vercel preset outputs
const targets = [
  resolve(__dirname, "../.output/server/_libs/tslib.mjs"),
  resolve(__dirname, "../.vercel/output/functions/__server.func/_libs/tslib.mjs"),
];

for (const target of targets) {
  if (existsSync(target)) {
    const current = readFileSync(target, "utf-8").trim();
    if (current.length < 10) {
      writeFileSync(target, tslibContent, "utf-8");
      console.log("✅ Patched tslib stub at:", target);
    } else {
      console.log("ℹ️  tslib already has content at:", target);
    }
  } else {
    console.log("⚠️  Target not found (skipping):", target);
  }
}

console.log("✅ tslib fix complete.");
