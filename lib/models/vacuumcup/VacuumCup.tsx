import type { VacuumCupModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createVacuumCupGeom } from "./geometry"
export type VacuumCupProps = VacuumCupModelPropsInput & { color?: string }
export function VacuumCup({ color = "#929da9", ...props }: VacuumCupProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createVacuumCupGeom(props)} />
    </Colorize>
  )
}
