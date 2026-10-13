import type { UniversalJointModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createUniversalJointParts } from "./geometry"
export type UniversalJointProps = UniversalJointModelPropsInput & {
  color?: string
  crossColor?: string
}
export function UniversalJoint({
  color = "#929da9",
  crossColor = "#566575",
  ...props
}: UniversalJointProps) {
  const parts = createUniversalJointParts(props)
  return (
    <>
      <Colorize color={color}>
        <Custom geometry={parts.forks} />
      </Colorize>
      <Colorize color={crossColor}>
        <Custom geometry={parts.cross} />
      </Colorize>
    </>
  )
}
