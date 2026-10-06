import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import { watchModelRenderers } from "./watch-model-renderers.mjs"

const watcher = await watchModelRenderers()
const cosmosScript = createRequire(import.meta.url).resolve(
  "react-cosmos/bin/cosmos.js",
)
const child = spawn(
  process.execPath,
  [cosmosScript, ...process.argv.slice(2)],
  {
    stdio: "inherit",
  },
)
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal))
}
child.on("error", (error) => {
  console.error(error)
  watcher.close()
  process.exitCode = 1
})
child.on("exit", (code, signal) => {
  watcher.close()
  process.exitCode = code ?? (signal === "SIGINT" ? 130 : 1)
})
