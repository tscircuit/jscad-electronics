import jscad from "@jscad/modeling"
import {
  keyedShaftModelPropsSchema,
  type KeyedShaftModelPropsInput,
} from "@tscircuit/modelprinter"
const { primitives, extrusions, booleans, geometries, measurements } = jscad
/** A round drive shaft with a rectangular longitudinal keyway centered along its length and 45-degree chamfers at both outer end edges. The shaft axis is +Z, its bottom face is Z=0, and the keyway opens toward +Y. keyDepth measures radially inward from the nominal outermost +Y surface; keyLength excludes the solid end sections. */
function createKeyedShaftRawGeom(input: KeyedShaftModelPropsInput) {
  const p = keyedShaftModelPropsSchema.parse(input)
  const r = p.diameter / 2
  const c = p.endChamfer
  const profile: [number, number][] =
    c === 0
      ? [
          [0, 0],
          [r, 0],
          [r, p.length],
          [0, p.length],
        ]
      : [
          [0, 0],
          [r - c, 0],
          [r, c],
          [r, p.length - c],
          [r - c, p.length],
          [0, p.length],
        ]
  const shaft = extrusions.extrudeRotate(
    { segments: 128 },
    primitives.polygon({ points: profile }),
  )
  const keyway = primitives.cuboid({
    size: [p.keyWidth, p.diameter, p.keyLength],
    center: [0, r - p.keyDepth + p.diameter / 2, p.length / 2],
  })
  return booleans.subtract(shaft, keyway)
}

/** Triangulate convex CSG faces after welding and splitting shared boundary edges.
 * JSCAD snapping scales with overall length and can distort a small fitting feature.
 * Keeping exact coordinates and adding every boundary T-junction preserves fit.
 */
export function createKeyedShaftMesh(input: KeyedShaftModelPropsInput) {
  const geom = createKeyedShaftRawGeom(input)
  const epsilon = Math.max(...measurements.measureDimensions(geom)) * 1e-9
  const positions: number[] = []
  const indices: number[] = []
  const lookup = new Map<string, number>()
  const vertex = (point: number[]) => {
    const key = point.map((value) => Math.round(value / epsilon)).join(",")
    let index = lookup.get(key)
    if (index === undefined) {
      index = positions.length / 3
      positions.push(...point)
      lookup.set(key, index)
    }
    return index
  }
  const faces = geometries.geom3
    .toPolygons(geom)
    .map((face) => {
      const raw = face.vertices.map(vertex)
      return raw.filter(
        (index, i) => index !== raw[(i + raw.length - 1) % raw.length],
      )
    })
    .filter((face) => face.length >= 3)
  const point = (index: number) => positions.slice(index * 3, index * 3 + 3)
  const boundaryPoints = Array.from({ length: positions.length / 3 }, (_, i) =>
    point(i),
  )
  for (const face of faces) {
    const boundary: number[] = []
    for (let i = 0; i < face.length; i++) {
      const start = face[i]!,
        end = face[(i + 1) % face.length]!
      const a = point(start),
        b = point(end)
      const u = b.map((value, axis) => value - a[axis]!)
      const squaredLength = u.reduce((sum, value) => sum + value * value, 0)
      const splits = [{ t: 0, index: start }]
      for (const [index, candidate] of boundaryPoints.entries()) {
        if (index === start || index === end) continue
        const t =
          u.reduce(
            (sum, value, axis) => sum + value * (candidate[axis]! - a[axis]!),
            0,
          ) / squaredLength
        if (t <= 0 || t >= 1) continue
        const distance = Math.hypot(
          ...candidate.map((value, axis) => value - a[axis]! - t * u[axis]!),
        )
        if (distance <= epsilon) splits.push({ t, index })
      }
      splits.sort((left, right) => left.t - right.t)
      boundary.push(...splits.map(({ index }) => index))
    }
    // Each CSG polygon is convex; its vertex centroid is inside the face.
    const center = [0, 0, 0]
    for (const index of boundary)
      for (let axis = 0; axis < 3; axis++)
        center[axis]! += positions[index * 3 + axis]! / boundary.length
    const middle = vertex(center)
    for (let i = 0; i < boundary.length; i++) {
      const a = boundary[i]!,
        b = boundary[(i + 1) % boundary.length]!
      const u = point(a).map((value, axis) => value - center[axis]!)
      const v = point(b).map((value, axis) => value - center[axis]!)
      const area = Math.hypot(
        u[1]! * v[2]! - u[2]! * v[1]!,
        u[2]! * v[0]! - u[0]! * v[2]!,
        u[0]! * v[1]! - u[1]! * v[0]!,
      )
      if (a !== b && a !== middle && b !== middle && area > epsilon * epsilon)
        indices.push(middle, a, b)
    }
  }
  return { positions, indices }
}

/** Return the same welded, closed surface used by the indexed mesh factory. */
export function createKeyedShaftGeom(input: KeyedShaftModelPropsInput) {
  const mesh = createKeyedShaftMesh(input)
  const triangles: [number, number, number][][] = []
  for (let i = 0; i < mesh.indices.length; i += 3) {
    triangles.push(
      mesh.indices
        .slice(i, i + 3)
        .map(
          (index) =>
            mesh.positions.slice(index * 3, index * 3 + 3) as [
              number,
              number,
              number,
            ],
        ),
    )
  }
  return geometries.geom3.fromPoints(triangles)
}
