import jscad from "@jscad/modeling"
import {
  vBlockModelPropsSchema,
  type VBlockModelPropsInput,
  type VBlockModelProps,
} from "@tscircuit/modelprinter"
const {
  booleans,
  primitives,
  extrusions,
  transforms,
  geometries,
  modifiers,
  measurements,
} = jscad
// JSCAD's runtime exports a function here; its default-export declaration is a namespace.
const generalize = modifiers.generalize as unknown as (
  options: { snap?: boolean; triangulate?: boolean },
  geometry: jscad.geometries.geom3.Geom3,
) => jscad.geometries.geom3.Geom3
const { subtract } = booleans
const { rectangle, roundedRectangle, polygon } = primitives
const { translate, rotateX, rotateY } = transforms
const profile = (shape: jscad.geometries.geom2.Geom2, height: number) =>
  extrusions.extrudeLinear({ height }, shape)
const roundedRect = (width: number, height: number, radius: number) =>
  radius
    ? roundedRectangle({
        size: [width, height],
        roundRadius: radius,
        segments: 64,
      })
    : rectangle({ size: [width, height] })

function vblock(p: VBlockModelProps) {
  const half = p.grooveDepth * Math.tan((p.grooveAngle * Math.PI) / 360)
  const shape = subtract(
    rectangle({ size: [p.width, p.height], center: [0, p.height / 2] }),
    polygon({
      points: [
        [-half, p.height],
        [0, p.height - p.grooveDepth],
        [half, p.height],
      ],
    }),
    rectangle({
      size: [p.mountGrooveDepth, p.mountGrooveWidth],
      center: [(p.width - p.mountGrooveDepth) / 2, p.mountGrooveZ],
    }),
    rectangle({
      size: [p.mountGrooveDepth, p.mountGrooveWidth],
      center: [-(p.width - p.mountGrooveDepth) / 2, p.mountGrooveZ],
    }),
  )
  return translate(
    [-p.length / 2, 0, 0],
    rotateX(Math.PI / 2, rotateY(Math.PI / 2, profile(shape, p.length))),
  )
}

/** Inspection block centered on XY, bottom Z=0. The centered V runs along X; vangle is its included angle. Both Y side faces have full-length rectangular clamp grooves centered at mountz. */
export function createVBlockGeom(input: VBlockModelPropsInput) {
  const p = vBlockModelPropsSchema.parse(input)
  return vblock(p)
}
export function createVBlockMesh(input: VBlockModelPropsInput) {
  const geom = generalize(
    { snap: true, triangulate: true },
    createVBlockGeom(input),
  )
  const epsilon = Math.max(...measurements.measureDimensions(geom)) * 1e-10
  const positions: number[] = []
  const indices: number[] = []
  const lookup = new Map<string, number>()
  const vertex = (v: number[]) => {
    const key = v.map((x) => Math.round(x / epsilon)).join(",")
    let index = lookup.get(key)
    if (index === undefined) {
      index = positions.length / 3
      positions.push(...v)
      lookup.set(key, index)
    }
    return index
  }
  for (const poly of geometries.geom3.toPolygons(geom)) {
    for (let i = 1; i < poly.vertices.length - 1; i++) {
      const a = poly.vertices[0]!,
        b = poly.vertices[i]!,
        c = poly.vertices[i + 1]!
      const u = b.map((x, j) => x - a[j]!),
        v = c.map((x, j) => x - a[j]!)
      const area = Math.hypot(
        u[1]! * v[2]! - u[2]! * v[1]!,
        u[2]! * v[0]! - u[0]! * v[2]!,
        u[0]! * v[1]! - u[1]! * v[0]!,
      )
      if (area > epsilon * epsilon)
        indices.push(vertex(a), vertex(b), vertex(c))
    }
  }
  return { positions, indices }
}
