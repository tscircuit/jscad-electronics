import { mp, nemaMotorModelPropsSchema } from "@tscircuit/modelprinter"
export type {
  NemaMotorModelProps,
  NemaMotorModelPropsInput,
  NemaSize,
} from "@tscircuit/modelprinter"

export const resolveNemaMotorProps = nemaMotorModelPropsSchema.parse.bind(
  nemaMotorModelPropsSchema,
)

export function parseNemaMotorString(source: string) {
  const definition = mp.string(source).json()
  if (definition.fn !== "nema")
    throw new Error("Expected nema8, nema17 or nema23")
  const { fn, ...props } = definition
  return props
}
