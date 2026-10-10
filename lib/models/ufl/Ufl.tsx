import type { UflModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createUflGeometries } from "./geometry"

export type UflProps = UflModelPropsInput

export function Ufl(props: UflProps) {
  return (
    <>
      {createUflGeometries(props).map(({ geom, color }, index) => (
        <Colorize key={index} color={color}>
          <Custom geometry={geom} />
        </Colorize>
      ))}
    </>
  )
}
