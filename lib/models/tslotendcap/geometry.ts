import jscad from "@jscad/modeling"
import {
  tSlotEndCapModelPropsSchema,
  type TSlotEndCapModelPropsInput,
} from "@tscircuit/modelprinter"
const { primitives, extrusions, booleans, geometries, measurements } = jscad
/** A rounded rectangular end cover with one central cylindrical friction pin. The cover underside and profile end mate at Z=0; the plate extends upward to Z=thickness and the pin inserts downward to Z=-pinLength. pinDiameter is the actual interference-fit envelope, not the target bore diameter. This custom model supports exactly one centered pin. */
function createTSlotEndCapRawGeom(input: TSlotEndCapModelPropsInput) {
  const p = tSlotEndCapModelPropsSchema.parse(input)
  const outline =
    p.cornerRadius === 0
      ? primitives.rectangle({ size: [p.width, p.height] })
      : primitives.roundedRectangle({
          size: [p.width, p.height],
          roundRadius: p.cornerRadius,
          segments: 128,
        })
  const cover = extrusions.extrudeLinear({ height: p.thickness }, outline)
  const pin = primitives.cylinder({
    radius: p.pinDiameter / 2,
    height: p.pinLength,
    center: [0, 0, -p.pinLength / 2],
    segments: 128,
  })
  return booleans.union(cover, pin)
}

/** Triangulate convex CSG faces after welding and splitting shared boundary edges.
 * JSCAD snapping scales with overall length and can distort a small fitting feature.
 * Keeping exact coordinates and adding every boundary T-junction preserves fit.
 */
export function createTSlotEndCapMesh(input: TSlotEndCapModelPropsInput) {
  const geom = createTSlotEndCapRawGeom(input)
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
export function createTSlotEndCapGeom(input: TSlotEndCapModelPropsInput) {
  const mesh = createTSlotEndCapMesh(input)
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
