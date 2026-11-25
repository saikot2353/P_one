import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { componentTagger } from "lovable-tagger";
import path from "path";
import { nitro } from "nitro/vite";

export default defineConfig(({ command, mode }) => {
  return {
    server: {
      port: 3000,
      host: true,
      strictPort: true,
      allowedHosts: true,
      cors: true,
      fs: {
        strict: false,
      },
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },

      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },

    ssr: {
      external: [
        "xlsx",
        "recharts",
        "jodit",
        "jodit-react",
        "@svg-maps/world",
      ],
      noExternal: ["tslib", "react-remove-scroll", "react-remove-scroll-bar"],
    },

    build: {
      target: "es2022",
      reportCompressedSize: false,
      chunkSizeWarningLimit: 3000,
      sourcemap: false,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("xlsx")) return "vendor-xlsx";
              if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
              if (id.includes("jodit")) return "vendor-editor";
              if (id.includes("@svg-maps")) return "vendor-maps";
              if (id.includes("lucide-react")) return "vendor-lucide";
              if (id.includes("@radix-ui")) return "vendor-radix";
              if (id.includes("date-fns")) return "vendor-date";
              if (id.includes("lodash")) return "vendor-lodash";
              if (id.includes("@tanstack/react-router") || id.includes("@tanstack/router-core")) return "vendor-router";
              if (id.includes("@tanstack/react-query") || id.includes("@tanstack/query-core")) return "vendor-query";
              if (id.includes("zod") || id.includes("react-hook-form") || id.includes("@hookform")) return "vendor-forms";
            }
          },
        },
      },
    },

    plugins: [
      tanstackStart({
        spa: {
          enabled: true,
        },
      }),

      command === "build" &&
        nitro({
          preset: "vercel",
        }),

      react(),

      tailwindcss(),

      mode === "development" && componentTagger(),
    ].filter(Boolean),
  };
});
