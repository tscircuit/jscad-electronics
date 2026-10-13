import type { PressureGaugeModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createPressureGaugeParts } from "./geometry"
export type PressureGaugeProps = PressureGaugeModelPropsInput & {
  color?: string
}
export function PressureGauge({ color, ...props }: PressureGaugeProps) {
  return (
    <>
      {createPressureGaugeParts(props).map((part, index) => (
        <Colorize
          key={part.name}
          color={index === 0 && color !== undefined ? color : part.color}
        >
          <Custom geometry={part.geometry} />
        </Colorize>
      ))}
    </>
  )
}
