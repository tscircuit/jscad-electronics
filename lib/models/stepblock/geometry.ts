import jscad from "@jscad/modeling"
import {
  stepBlockModelPropsSchema,
  type StepBlockModelPropsInput,
  type StepBlockModelProps,
} from "@tscircuit/modelprinter"
const {
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

const { rectangle, roundedRectangle, polygon } = primitives
const { translate, rotateX } = transforms
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

function steps(p: StepBlockModelProps) {
  const points: [number, number][] = [
    [0, 0],
    [p.length, 0],
    [p.length, p.height],
  ]
  for (let i = p.steps; i > 0; i--) {
    points.push([(i - 1) * p.stepRun, i * p.stepRise])
    points.push([(i - 1) * p.stepRun, (i - 1) * p.stepRise])
  }
  // The final point coincides with the first; omit it for a valid contour.
  points.pop()
  return translate(
    [-p.length / 2, p.width / 2, 0],
    rotateX(Math.PI / 2, profile(polygon({ points }), p.width)),
  )
}

/** Solid stair-step clamp support centered on XY, bottom Z=0. Staircase rises from -X toward +X. Equal runs and rises must exactly span the specified length and height. */
export function createStepBlockGeom(input: StepBlockModelPropsInput) {
  const p = stepBlockModelPropsSchema.parse(input)
  return steps(p)
}
export function createStepBlockMesh(input: StepBlockModelPropsInput) {
  const geom = generalize(
    { snap: true, triangulate: true },
    createStepBlockGeom(input),
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
