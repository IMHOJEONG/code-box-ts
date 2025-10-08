import react from "@vitejs/plugin-react-swc";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
// https://vite.dev/config/
import wasm from "vite-plugin-wasm";

export default defineConfig({
      assetsInclude: ["**/*.wasm"], // .wasm 파일을 정적 자산으로 포함
      build: {
            cssMinify: "lightningcss",
      },
      css: {
            lightningcss: {
                  targets: browserslistToTargets(browserslist(">= 0.25%")),
            },
            transformer: "lightningcss",
      },

      optimizeDeps: {
            exclude: ["@swc/wasm-web"],
      },
      plugins: [react(), wasm(), topLevelAwait()],
      worker: {
            // Not needed with vite-plugin-top-level-await >= 1.3.0
            // format: "es",
            plugins: () => [wasm(), topLevelAwait()],
      },
      resolve: {
            alias: [{ find: "@", replacement: "/src" }],
      },
});
