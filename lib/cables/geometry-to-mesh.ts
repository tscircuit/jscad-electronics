import jscad from "@jscad/modeling"
import type { Geom3 } from "@jscad/modeling/src/geometries/geom3"
import type { CableMesh, CableColor, CableFrame, CablePoint } from "./types"
import { add, scale } from "./path-frames"

type VertexKey = string

export function geometryToCableMesh({
  geometry,
  color,
  name,
}: { geometry: Geom3; color: CableColor; name: string }): CableMesh {
  const triangles = jscad.geometries.geom3.toPolygons(geometry)
  const positions: number[] = []
  const indices: number[] = []
  const vertices = new Map<VertexKey, number>()
  for (const triangle of triangles) {
    const polygonIndices: number[] = []
    for (const point of triangle.vertices) {
      const key = point.map((coordinate) => coordinate.toFixed(8)).join(",")
      let index = vertices.get(key)
      if (index === undefined) {
        index = positions.length / 3
        positions.push(...point)
        vertices.set(key, index)
      }
      polygonIndices.push(index)
    }
    // JSCAD CSG polygons are convex, so a fan preserves their outward winding.
    for (let side = 1; side < polygonIndices.length - 1; side++) {
      indices.push(
        polygonIndices[0]!,
        polygonIndices[side]!,
        polygonIndices[side + 1]!,
      )
    }
  }
  return { name, positions, indices, color, smooth: false }
}

export function placeConnectorMesh({
  mesh,
  frame,
  wireExitDepth,
  isEnd,
}: {
  mesh: CableMesh
  frame: CableFrame
  wireExitDepth: number
  isEnd: boolean
}): CableMesh {
  const tangent = scale(frame.tangent, isEnd ? -1 : 1)
  const binormal: CablePoint = isEnd
    ? scale(frame.binormal, -1)
    : frame.binormal
  const origin = add(frame.point, scale(tangent, -wireExitDepth))
  const positions: number[] = []
  for (let index = 0; index < mesh.positions.length; index += 3) {
    positions.push(
      ...add(
        origin,
        add(
          add(
            scale(frame.normal, mesh.positions[index]!),
            scale(binormal, mesh.positions[index + 1]!),
          ),
          scale(tangent, mesh.positions[index + 2]!),
        ),
      ),
    )
  }
  return { ...mesh, positions }
}
