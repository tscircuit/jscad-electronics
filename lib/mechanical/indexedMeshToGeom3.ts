import jscad from "@jscad/modeling"

/** Preserve the outward winding of the migrated indexed triangle surfaces. */
export function indexedMeshToGeom3(mesh: {
  positions: number[]
  indices: number[]
}) {
  const polygons: [number, number, number][][] = []
  for (let i = 0; i < mesh.indices.length; i += 3)
    polygons.push(
      mesh.indices
        .slice(i, i + 3)
        .map((index) => [
          mesh.positions[index * 3]!,
          mesh.positions[index * 3 + 1]!,
          mesh.positions[index * 3 + 2]!,
        ]),
    )
  return jscad.geometries.geom3.fromPoints(polygons)
}
