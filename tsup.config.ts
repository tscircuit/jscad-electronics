import { defineConfig } from "tsup";
import path from "path";

function aliasPlugin(aliases: Record<string, string>) {
  return {
    name: "alias",
    setup(build: any) {
      for (const [key, value] of Object.entries(aliases)) {
        const filter = new RegExp(`^${key}(?:$|/)`);
        build.onResolve({ filter }, (args: any) => {
          // Only alias the bare specifier or subpath; map to value for bare specifier
          return { path: value };
        });
      }
    },
  };
}

export default defineConfig([
  {
    entry: { index: "./lib/index.ts" },
    dts: true,
    format: ["esm"],
    sourcemap: true,
    splitting: false,
    clean: true,
  },
  {
    entry: { vanilla: "./lib/vanilla/index.ts" },
    dts: true,
    format: ["esm"],
    sourcemap: true,
    splitting: false,
    clean: false,
    noExternal: ["jscad-fiber", "react", "react-dom", "react/jsx-runtime"],
    // Configure esbuild for classic JSX and symbol injection
    esbuildOptions(options) {
      options.jsxFactory = "h";
      options.jsxFragment = "Fragment";
      (options as any).inject = [
        path.resolve(__dirname, "lib/vanilla/jsx-inject.ts"),
      ];
    },
    esbuildPlugins: [
      aliasPlugin({
        "jscad-fiber": path.resolve(__dirname, "lib/vanilla/primitives.ts"),
        react: path.resolve(__dirname, "lib/vanilla/react-shim.ts"),
        "react-dom": path.resolve(__dirname, "lib/vanilla/react-shim.ts"),
        "react/jsx-runtime": path.resolve(
          __dirname,
          "lib/vanilla/react-shim.ts",
        ),
      }),
    ],
  },
]);
