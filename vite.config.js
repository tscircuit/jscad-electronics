import { defineConfig } from "vite"

export default defineConfig({
  optimizeDeps: {
    needsInterop: ["@tscircuit/footprinter", "jscad-fiber", "@tscircuit/mm"],
  },
  define: {
    "global": {}
  },
  "build": {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})