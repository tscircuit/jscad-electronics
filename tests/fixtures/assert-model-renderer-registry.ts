import { expect } from "bun:test"
import {
  mp,
  spurGearModelDefinitionSchema,
  type ModelDefinition,
} from "@tscircuit/modelprinter"
import { createElement } from "react"
import {
  defineModelRenderer,
  ModelRendererRegistry,
  type ModelRenderer,
} from "../../lib/model-registry"
import { modelRendererRegistry } from "../../lib/default-model-registry"
import {
  builtinModelRenderers,
  registerAllModelRenderers,
} from "../../lib/generated/model-renderers"

function spurRenderer(marker: string) {
  return defineModelRenderer({
    name: "spurgear",
    schema: spurGearModelDefinitionSchema,
    render: () => createElement("span", { "data-renderer": marker }),
    pads: "none",
  })
}

export function assertModelRendererRegistryIsolation() {
  const first = new ModelRendererRegistry()
  const second = new ModelRendererRegistry()
  const originalNames = modelRendererRegistry.getModelNames()
  const definition = mp.string("spurgear").json()
  expect(first.getModelNames()).toEqual([])
  expect(second.getModelNames()).toEqual([])
  expect(first.render(definition)).toBeUndefined()
  first.register(spurRenderer("first"))
  expect(first.getModelNames()).toEqual(["spurgear"])
  expect(second.get("spurgear")).toBeUndefined()
  expect(second.render(definition)).toBeUndefined()
  second.register(spurRenderer("second"))
  expect<unknown>(first.render(definition)?.props).toEqual({
    "data-renderer": "first",
  })
  expect<unknown>(second.render(definition)?.props).toEqual({
    "data-renderer": "second",
  })
  expect(first.get("spurgear")?.pads).toBe("none")
  expect(first.get("spurgear")?.schema).toBe(spurGearModelDefinitionSchema)
  const detachedNames = first.getModelNames()
  detachedNames.push("tampered")
  expect(first.getModelNames()).toEqual(["spurgear"])
  expect(modelRendererRegistry.getModelNames()).toEqual(originalNames)

  const descriptor = { ...spurRenderer("snapshotted") }
  const third = new ModelRendererRegistry()
  third.register(descriptor)
  descriptor.render = spurRenderer("changed").render
  expect<unknown>(third.render(definition)?.props).toEqual({
    "data-renderer": "snapshotted",
  })

  const explicit = new ModelRendererRegistry()
  registerAllModelRenderers(explicit)
  expect(explicit.getModelNames()).toEqual(originalNames)
  expect(originalNames).toEqual(
    builtinModelRenderers.map((model) => model.name),
  )
  expect(new Set(originalNames).size).toBe(originalNames.length)
  for (const name of [
    "flexscreen",
    "helicalgear",
    "hexbolt",
    "hexsocketbolt",
    "nema",
    "sheetmetal",
    "spurgear",
    "wormgear",
  ]) {
    expect(modelRendererRegistry.get(name)).toBeDefined()
  }
  expect(modelRendererRegistry.get("flexscreen")?.pads).toBe("footprinter")
  for (const name of originalNames.filter((name) => name !== "flexscreen")) {
    // Future copper-pad models may be discovered without changing this fixture.
    if (
      [
        "helicalgear",
        "hexbolt",
        "hexsocketbolt",
        "nema",
        "sheetmetal",
        "spurgear",
        "wormgear",
      ].includes(name)
    ) {
      expect(modelRendererRegistry.get(name)?.pads).toBe("none")
    }
  }
}

export function assertModelRendererRegistryErrorsAndIdentity() {
  const registry = new ModelRendererRegistry()
  const definition = mp.string("spurgear").json()
  if (definition.fn !== "spurgear") throw new Error("Expected a spur gear")
  let callbackCalls = 0
  let schemaCalls = 0
  let received: unknown
  const element = createElement("span", { "data-renderer": "original" })
  registry.register(
    defineModelRenderer({
      name: "spurgear",
      schema: {
        parse: () => {
          schemaCalls++
          throw new Error("A normalized definition must not be parsed again")
        },
      },
      render: (input) => {
        callbackCalls++
        received = input
        return element
      },
      pads: "none",
    }),
  )
  expect(registry.render(definition)).toBe(element)
  expect<unknown>(received).toBe(definition)
  expect(callbackCalls).toBe(1)
  expect(schemaCalls).toBe(0)
  expect(() => registry.register(spurRenderer("replacement"))).toThrow(
    'Model renderer "spurgear" is already registered',
  )
  expect(registry.render(definition)).toBe(element)
  expect(callbackCalls).toBe(2)
  expect(registry.getModelNames()).toEqual(["spurgear"])
  const wrongModel = mp.string("wormgear").json()
  expect(() => registry.get("spurgear")!.render(wrongModel)).toThrow(
    'Renderer for "spurgear" requires a model with fn "spurgear"',
  )
  expect(() =>
    registry.get("spurgear")!.render(null as unknown as ModelDefinition),
  ).toThrow('Renderer for "spurgear" requires a model with fn "spurgear"')
  expect(registry.render(wrongModel)).toBeUndefined()
  expect(registry.get("registryfixturemissing")).toBeUndefined()
  expect(callbackCalls).toBe(2)

  for (const name of [
    "",
    "Spurgear",
    "spur-gear",
    "spurgear1",
    null,
    undefined,
    new String("spurgear"),
  ]) {
    const descriptor = {
      ...spurRenderer("invalid"),
      name,
    } as unknown as ModelRenderer<"spurgear">
    expect(() => new ModelRendererRegistry().register(descriptor)).toThrow(
      "Model renderer names must contain only lowercase letters",
    )
  }
  const invalidPads = {
    ...spurRenderer("invalid"),
    pads: "copper",
  } as unknown as ModelRenderer<"spurgear">
  const clean = new ModelRendererRegistry()
  expect(() => clean.register(invalidPads)).toThrow(
    'Model renderer pads must be "none" or "footprinter"',
  )
  expect(clean.getModelNames()).toEqual([])
  clean.register(spurRenderer("valid"))
  expect(clean.getModelNames()).toEqual(["spurgear"])
}
