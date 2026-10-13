import jscad from "@jscad/modeling"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
export const { union, subtract, intersect } = jscad.booleans
export const { translate, rotateX, rotateY, rotateZ, scale } = jscad.transforms
export const { cuboid, sphere, cylinder, cylinderElliptic, torus, polygon } =
  jscad.primitives
export const { extrudeLinear } = jscad.extrusions
export type Point = [number, number, number]
export const round = (diameter: number, height: number, z = 0, segments = 64) =>
  cylinder({
    radius: diameter / 2,
    height,
    center: [0, 0, z + height / 2],
    segments,
  })
export const hex = (acrossFlats: number, height: number, z = 0) =>
  rotateZ(Math.PI / 6, round((2 * acrossFlats) / Math.sqrt(3), height, z, 6))
export const bore = (diameter: number, height: number) =>
  round(diameter, height + 2, -1)
/** A true spherical cap of the requested height, with its flat base at z. */
export function dome(diameter: number, height: number, z: number) {
  const radius = ((diameter * diameter) / 4 + height * height) / (2 * height)
  return intersect(
    translate([0, 0, z + height - radius], sphere({ radius, segments: 48 })),
    cuboid({
      size: [diameter * 2, diameter * 2, height],
      center: [0, 0, z + height / 2],
    }),
  )
}
/** Closed annular rectangular section following a variable axial height. */
export function profiledRing(
  inner: number,
  outer: number,
  thickness: number,
  zAt: (angle: number, outer: boolean) => number,
) {
  const n = 96,
    positions: number[] = [],
    indices: number[] = []
  for (let i = 0; i < n; i++) {
    const a = (i * Math.PI * 2) / n
    for (const [radius, out, top] of [
      [inner / 2, false, false],
      [outer / 2, true, false],
      [inner / 2, false, true],
      [outer / 2, true, true],
    ] as const)
      positions.push(
        radius * Math.cos(a),
        radius * Math.sin(a),
        zAt(a, out) + (top ? thickness : 0),
      )
  }
  for (let i = 0; i < n; i++) {
    const a = i * 4,
      b = ((i + 1) % n) * 4
    indices.push(a, b + 1, a + 1, a, b, b + 1) // bottom
    indices.push(a + 2, a + 3, b + 3, a + 2, b + 3, b + 2) // top
    indices.push(a + 1, b + 1, b + 3, a + 1, b + 3, a + 3) // outer
    indices.push(a, a + 2, b + 2, a, b + 2, b) // bore
  }
  return indexedMeshToGeom3({ positions, indices })
}
/** Continuous round wire swept along a planar path, with closed flat ends. */
export function wirePath(path: Point[], diameter: number) {
  const radial = 20,
    positions: number[] = [],
    indices: number[] = []
  path.forEach((point, i) => {
    const previous = path[Math.max(0, i - 1)]!,
      next = path[Math.min(path.length - 1, i + 1)]!
    const t = next.map((x, j) => x - previous[j]!) as Point
    const mag = Math.hypot(...t)
    t.forEach((x, j) => {
      t[j] = x / mag
    })
    const u: Point = path.every((p) => p[1] === path[0]![1])
      ? [0, 1, 0]
      : [0, 0, 1]
    const dot = t[0] * u[0] + t[1] * u[1] + t[2] * u[2]
    u.forEach((x, j) => {
      u[j] = x - dot * t[j]!
    })
    const umag = Math.hypot(...u)
    u.forEach((x, j) => {
      u[j] = x / umag
    })
    const v: Point = [
      t[1] * u[2] - t[2] * u[1],
      t[2] * u[0] - t[0] * u[2],
      t[0] * u[1] - t[1] * u[0],
    ]
    for (let k = 0; k < radial; k++) {
      const a = (k * Math.PI * 2) / radial
      positions.push(
        ...point.map(
          (x, j) =>
            x + (diameter / 2) * (Math.cos(a) * u[j]! + Math.sin(a) * v[j]!),
        ),
      )
    }
  })
  for (let i = 0; i < path.length - 1; i++)
    for (let k = 0; k < radial; k++) {
      const a = i * radial + k,
        b = i * radial + ((k + 1) % radial),
        c = (i + 1) * radial + k,
        d = (i + 1) * radial + ((k + 1) % radial)
      indices.push(a, b, d, a, d, c)
    }
  for (const [station, up] of [
    [0, false],
    [path.length - 1, true],
  ] as const) {
    const center = positions.length / 3
    positions.push(...path[station]!)
    for (let k = 0; k < radial; k++)
      indices.push(
        center,
        station * radial + (up ? k : (k + 1) % radial),
        station * radial + (up ? (k + 1) % radial : k),
      )
  }
  return indexedMeshToGeom3({ positions, indices })
}
