import type { JawCouplingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createJawCouplingParts } from "./geometry"
export type JawCouplingProps = JawCouplingModelPropsInput & {
  color?: string
  spiderColor?: string
}
export function JawCoupling({
  color = "#929da9",
  spiderColor = "#db7540",
  ...props
}: JawCouplingProps) {
  const parts = createJawCouplingParts(props)
  return (
    <>
      <Colorize color={color}>
        <Custom geometry={parts.hubs} />
      </Colorize>
      <Colorize color={spiderColor}>
        <Custom geometry={parts.spider} />
      </Colorize>
    </>
  )
}
