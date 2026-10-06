import { watch } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { generateModelRenderers } from "./generate-model-renderers.mjs"

export async function watchModelRenderers() {
  await generateModelRenderers()
  let timer
  let generation = Promise.resolve()
  const watcher = watch(
    fileURLToPath(new URL("../lib", import.meta.url)),
    { recursive: true },
    (_event, filename) => {
      if (
        filename !== null &&
        !/^models(?:[/\\]|$)/.test(filename.toString())
      ) {
        return
      }
      clearTimeout(timer)
      timer = setTimeout(() => {
        generation = generation
          .then(async () => {
            const { changedFiles } = await generateModelRenderers()
            if (changedFiles.length) console.log("Regenerated model renderers")
          })
          .catch((error) => {
            console.error("Model renderer generation failed:", error)
            process.exitCode = 1
          })
      }, 75)
    },
  )
  return {
    close() {
      clearTimeout(timer)
      watcher.close()
    },
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  await watchModelRenderers()
  console.log("Watching lib/models for renderer additions and removals")
}
