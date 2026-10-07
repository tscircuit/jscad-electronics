import type { LinearBearingBlockModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import { createLinearBearingBlockMesh } from "./mesh"

export type LinearBearingBlockProps = LinearBearingBlockModelPropsInput & {
  color?: string
}

export function createLinearBearingBlockGeom(
  input: LinearBearingBlockModelPropsInput = {},
) {
  return indexedMeshToGeom3(createLinearBearingBlockMesh(input))
}

/** Separately colored physical parts retain their individual closed surfaces. */
export function LinearBearingBlock({
  color,
  ...props
}: LinearBearingBlockProps) {
  const { parts } = createLinearBearingBlockMesh(props)
  return (
    <>
      {parts.map((part) => (
        <Colorize key={part.name} color={color ?? part.color}>
          <Custom geometry={indexedMeshToGeom3(part.mesh)} />
        </Colorize>
      ))}
    </>
  )
}

export { createLinearBearingBlockMesh } from "./mesh"
export type {
  LinearBearingBlockMesh,
  LinearBearingBlockMeshPart,
  LinearBearingBlockMeshOptions,
} from "./mesh"
