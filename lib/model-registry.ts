import type { ModelDefinition } from "@tscircuit/modelprinter"
import type { JSX } from "react"

export type ModelRendererName = ModelDefinition["fn"]
export type ModelRendererDefinition<Name extends ModelRendererName> = Extract<
  ModelDefinition,
  { fn: Name }
>
export type ModelPadBehavior = "none" | "footprinter"

type IsUnion<Value, Whole = Value> = Value extends Whole
  ? [Whole] extends [Value]
    ? false
    : true
  : never

type LiteralModelName<Name extends ModelRendererName> =
  true extends IsUnion<Name> ? never : Name

export type ModelRenderer<Name extends ModelRendererName> = {
  readonly name: Name
  readonly schema: {
    parse(input: unknown): ModelRendererDefinition<NoInfer<Name>>
  }
  readonly render: (
    definition: ModelRendererDefinition<NoInfer<Name>>,
  ) => JSX.Element | null
  readonly pads: ModelPadBehavior
}

/** Keep the contract discriminator, schema output, and render input aligned. */
export function defineModelRenderer<const Name extends ModelRendererName>(
  model: ModelRenderer<Name> & {
    readonly name: LiteralModelName<NoInfer<Name>>
  },
): ModelRenderer<Name> {
  return model
}

type RegisteredModelRenderer = {
  readonly name: ModelRendererName
  readonly schema: { parse(input: unknown): ModelDefinition }
  readonly render: (definition: ModelDefinition) => JSX.Element | null
  readonly pads: ModelPadBehavior
}

/** Renderer registrations belong to this instance, never to globalThis. */
export class ModelRendererRegistry {
  private readonly models = new Map<string, RegisteredModelRenderer>()

  register<const Name extends ModelRendererName>(
    model: ModelRenderer<Name> & {
      readonly name: LiteralModelName<NoInfer<Name>>
    },
  ): void {
    if (typeof model.name !== "string" || !/^[a-z]+$/.test(model.name)) {
      throw new Error(
        "Model renderer names must contain only lowercase letters",
      )
    }
    if (this.models.has(model.name)) {
      throw new Error(`Model renderer "${model.name}" is already registered`)
    }
    if (model.pads !== "none" && model.pads !== "footprinter") {
      throw new Error('Model renderer pads must be "none" or "footprinter"')
    }
    const { name, schema, render, pads } = model
    this.models.set(name, {
      name,
      schema,
      pads,
      render: (definition) => {
        if (!definition || definition.fn !== name) {
          throw new Error(
            `Renderer for "${name}" requires a model with fn "${name}"`,
          )
        }
        // Registration ties this discriminator to the callback's input type.
        // The caller has already validated and normalized the MP definition;
        // do not repeat schema transforms or copy its object here.
        return render(definition as ModelRendererDefinition<Name>)
      },
    })
  }

  get(name: string): RegisteredModelRenderer | undefined {
    return this.models.get(name)
  }

  getModelNames(): string[] {
    return [...this.models.keys()]
  }

  render(definition: ModelDefinition): JSX.Element | null | undefined {
    return this.models.get(definition.fn)?.render(definition)
  }
}
