import type { OldhamCouplingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createOldhamCouplingParts } from "./geometry"
export type OldhamCouplingProps = OldhamCouplingModelPropsInput & {
  color?: string
  diskColor?: string
}
export function OldhamCoupling({
  color = "#929da9",
  diskColor = "#da7945",
  ...props
}: OldhamCouplingProps) {
  const parts = createOldhamCouplingParts(props)
  return (
    <>
      <Colorize color={color}>
        <Custom geometry={parts.hubs} />
      </Colorize>
      <Colorize color={diskColor}>
        <Custom geometry={parts.disk} />
      </Colorize>
    </>
  )
}
