import { generateModelRenderers } from "./generate-model-renderers.mjs"
import { prepareModelContracts } from "./prepare-model-contracts.mjs"

await prepareModelContracts()
await generateModelRenderers()
