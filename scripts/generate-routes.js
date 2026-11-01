import { Generator, getConfig } from "@tanstack/router-generator";

async function main() {
  try {
    const config = await getConfig();
    const generator = new Generator({ config, root: process.cwd() });
    await generator.run();
    console.log("✔ Route tree generated successfully in src/routeTree.gen.ts");
  } catch (error) {
    console.error("Failed to generate route tree:", error);
    process.exit(1);
  }
}

main();

