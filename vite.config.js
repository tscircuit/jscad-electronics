import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  optimizeDeps: {
    needsInterop: ["jscad-fiber", "@tscircuit/mm"],
  },
  plugins: [tsconfigPaths()],
  define: {
    global: {},
  },
  resolve: {
    alias: {
      "jscad-fiber": "jscad-fiber-shim.ts",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
