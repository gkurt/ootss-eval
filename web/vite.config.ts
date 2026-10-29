import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  // relative asset paths, so the built site works from any folder (GitHub Pages included)
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
      // the rules engine the kit scores with; the replays run the same file
      "@engine": resolve(import.meta.dirname, "../kit/engine/ootss.mjs"),
    },
  },
  // polling: native file events are missed on some drives, which serves stale modules
  server: { fs: { allow: [".."] }, watch: { usePolling: true, interval: 300 } },
  build: { target: "es2023", chunkSizeWarningLimit: 1200 },
})
