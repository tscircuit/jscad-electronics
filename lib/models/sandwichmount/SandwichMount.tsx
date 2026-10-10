import type { SandwichMountModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createSandwichMountParts } from "./geometry"
export type SandwichMountProps = SandwichMountModelPropsInput & {
  color?: string
  coreColor?: string
}
export function SandwichMount({
  color = "#929da9",
  coreColor = "#333333",
  ...props
}: SandwichMountProps) {
  const parts = createSandwichMountParts(props)
  return (
    <>
      <Colorize color={color}>
        <Custom geometry={parts.bottom} />
        <Custom geometry={parts.top} />
      </Colorize>
      <Colorize color={coreColor}>
        <Custom geometry={parts.core} />
      </Colorize>
    </>
  )
}
