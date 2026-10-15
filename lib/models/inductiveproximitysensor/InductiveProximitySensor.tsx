import type { InductiveProximitySensorModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createInductiveProximitySensorGeom } from "./geometry"
export type InductiveProximitySensorProps =
  InductiveProximitySensorModelPropsInput & { color?: string }
export function InductiveProximitySensor({
  color = "#929da9",
  ...props
}: InductiveProximitySensorProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createInductiveProximitySensorGeom(props)} />
    </Colorize>
  )
}
