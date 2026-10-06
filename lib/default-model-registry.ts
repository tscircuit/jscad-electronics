import { registerAllModelRenderers } from "./generated/model-renderers"
import { ModelRendererRegistry } from "./model-registry"

export const modelRendererRegistry = new ModelRendererRegistry()
registerAllModelRenderers(modelRendererRegistry)
