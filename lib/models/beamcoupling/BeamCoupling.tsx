import type { BeamCouplingModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createBeamCouplingGeom } from "./geometry"
export type BeamCouplingProps = BeamCouplingModelPropsInput & { color?: string }
export function BeamCoupling({
  color = "#929da9",
  ...props
}: BeamCouplingProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createBeamCouplingGeom(props)} />
    </Colorize>
  )
}
