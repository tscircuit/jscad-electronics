import jscad from "@jscad/modeling"
import {
  sandwichMountModelPropsSchema,
  type SandwichMountModelPropsInput,
  type SandwichMountModelProps,
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
const { rectangle, roundedRectangle, circle } = primitives
const { translate } = transforms
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

function sandwich(p: SandwichMountModelProps) {
  const holes = []
  for (const x of [-p.holePitch / 2, p.holePitch / 2])
    for (const y of [-p.holePitch / 2, p.holePitch / 2])
      holes.push(
        circle({ radius: p.holeDiameter / 2, segments: 48, center: [x, y] }),
      )
  return profile(
    subtract(rectangle({ size: [p.width, p.length] }), ...holes),
    p.height,
  )
}

/** Rectangular bonded isolator centered on XY, bottom Z=0. Equal end plates surround a solid elastomer core. Four plain bores on a centered square grid pass through the entire assembly so fixing access is explicit. No load rating implied. */
export function createSandwichMountGeom(input: SandwichMountModelPropsInput) {
  const p = sandwichMountModelPropsSchema.parse(input)
  return sandwich(p)
}
function toMesh(source: jscad.geometries.geom3.Geom3) {
  const geom = generalize({ snap: true, triangulate: true }, source)
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

export function createSandwichMountMesh(input: SandwichMountModelPropsInput) {
  return toMesh(createSandwichMountGeom(input))
}
export function createSandwichMountParts(input: SandwichMountModelPropsInput) {
  const p = sandwichMountModelPropsSchema.parse(input)
  const bottom = sandwich({ ...p, height: p.plateThickness })
  const core = translate(
    [0, 0, p.plateThickness],
    sandwich({ ...p, height: p.coreHeight }),
  )
  const top = translate(
    [0, 0, p.plateThickness + p.coreHeight],
    sandwich({ ...p, height: p.plateThickness }),
  )
  return { bottom, core, top }
}
export function createSandwichMountMeshes(input: SandwichMountModelPropsInput) {
  const { bottom, core, top } = createSandwichMountParts(input)
  return { bottom: toMesh(bottom), core: toMesh(core), top: toMesh(top) }
}
