import { createElement } from "react"
import {
  spurGearModelDefinitionSchema,
  wormGearModelDefinitionSchema,
  type SpurGearModelDefinition,
  type WormGearModelDefinition,
} from "@tscircuit/modelprinter"
import {
  defineModelRenderer,
  ModelRendererRegistry,
} from "../../lib/model-registry"

/** Compile-only assertions: this function is never invoked. */
export function assertModelRendererRegistrationTypes() {
  const renderSpur = (_definition: SpurGearModelDefinition) =>
    createElement("span")
  const renderWorm = (_definition: WormGearModelDefinition) =>
    createElement("span")
  const model = defineModelRenderer({
    name: "spurgear",
    schema: spurGearModelDefinitionSchema,
    render: (definition) => {
      const name: "spurgear" = definition.fn
      const toothCount: number = definition.toothCount
      void [name, toothCount]
      // @ts-expect-error A spur-gear callback cannot access worm-only properties.
      definition.starts
      return createElement("span")
    },
    pads: "none",
  })
  const name: "spurgear" = model.name
  void name
  const registry = new ModelRendererRegistry()
  registry.register(model)
  defineModelRenderer({
    name: "spurgear",
    // @ts-expect-error The modelprinter schema discriminator must match the renderer name.
    schema: wormGearModelDefinitionSchema,
    render: renderSpur,
    pads: "none",
  })
  defineModelRenderer({
    name: "spurgear",
    schema: spurGearModelDefinitionSchema,
    // @ts-expect-error The callback receives the named modelprinter definition.
    render: renderWorm,
    pads: "none",
  })
  registry.register({
    name: "spurgear",
    // @ts-expect-error Direct registration cannot widen a mismatched schema's name.
    schema: wormGearModelDefinitionSchema,
    render: renderSpur,
    pads: "none",
  })
  registry.register({
    name: "spurgear",
    schema: spurGearModelDefinitionSchema,
    // @ts-expect-error Direct registration also checks callback discriminators.
    render: renderWorm,
    pads: "none",
  })
  defineModelRenderer({
    // @ts-expect-error A renderer name must exist in the modelprinter definition union.
    name: "registryfixturemissing",
    schema: spurGearModelDefinitionSchema,
    render: () => null,
    pads: "none",
  })
  const unionName = Math.random() ? "spurgear" : "wormgear"
  defineModelRenderer({
    // @ts-expect-error A descriptor has one literal model name rather than a union.
    name: unionName,
    schema: spurGearModelDefinitionSchema,
    render: () => null,
    pads: "none",
  })
  defineModelRenderer<"spurgear" | "wormgear">({
    // @ts-expect-error Explicit generic unions cannot conceal mismatched descriptors.
    name: "spurgear",
    schema: spurGearModelDefinitionSchema,
    render: () => null,
    pads: "none",
  })
  defineModelRenderer({
    name: "spurgear",
    schema: spurGearModelDefinitionSchema,
    render: renderSpur,
    // @ts-expect-error Pad behavior is explicit and limited to the two supported policies.
    pads: "copper",
  })
}
