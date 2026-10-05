import type { CompressionSpringModelPropsInput } from "@tscircuit/modelprinter"
import { Colorize, Custom } from "jscad-fiber"
import { createCompressionSpringMesh } from "./mechanical/compression-spring-mesh"
import { indexedMeshToGeom3 } from "./mechanical/indexedMeshToGeom3"

export type CompressionSpringProps = CompressionSpringModelPropsInput & {
  color?: string
}

export function createCompressionSpringGeom(
  input: CompressionSpringModelPropsInput,
) {
  return indexedMeshToGeom3(createCompressionSpringMesh(input))
}

export function CompressionSpring({
  color = "#737e8f",
  ...props
}: CompressionSpringProps) {
  return (
    <Colorize color={color}>
      <Custom geometry={createCompressionSpringGeom(props)} />
    </Colorize>
  )
}

export { createCompressionSpringMesh } from "./mechanical/compression-spring-mesh"
export type {
  CompressionSpringMesh,
  CompressionSpringMeshOptions,
} from "./mechanical/compression-spring-mesh"
