import {
  rectangularGasketModelPropsSchema,
  getRectangularGasketDimensions,
  type RectangularGasketModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  extrudePlanarProfile,
  circularProfile,
  type ProfilePoint,
} from "../../mechanical/extrude-planar-profile"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"

export interface RectangularGasketMesh {
  positions: number[]
  indices: number[]
}

/** Earcut may bridge to a point collinear with an opening's edge. Insert that
 * shared vertex into both incident triangle boundaries before triangulating;
 * otherwise the top face has a T-junction despite the watertight outline.
 */
function retainCapSeams(
  mesh: RectangularGasketMesh,
  tolerance: number,
): RectangularGasketMesh {
  const positions = [...mesh.positions],
    indices: number[] = []
  const count = mesh.positions.length / 3
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const ids = mesh.indices.slice(i, i + 3),
      boundary: number[] = []
    for (let side = 0; side < 3; side++) {
      const a = ids[side]!,
        b = ids[(side + 1) % 3]!
      const origin = positions.slice(a * 3, a * 3 + 3)
      const delta = positions
        .slice(b * 3, b * 3 + 3)
        .map((x, axis) => x - origin[axis]!)
      const lengthSquared = delta.reduce((sum, x) => sum + x * x, 0)
      const length = Math.sqrt(lengthSquared)
      const intermediate: { id: number; t: number }[] = []
      for (let id = 0; id < count; id++) {
        if (id === a || id === b) continue
        const point = positions.slice(id * 3, id * 3 + 3)
        const t =
          point.reduce(
            (sum, x, axis) => sum + (x - origin[axis]!) * delta[axis]!,
            0,
          ) / lengthSquared
        if (t * length <= tolerance || (1 - t) * length <= tolerance) continue
        if (
          Math.hypot(
            ...point.map((x, axis) => x - origin[axis]! - t * delta[axis]!),
          ) <= tolerance
        )
          intermediate.push({ id, t })
      }
      boundary.push(
        a,
        ...intermediate.sort((a, b) => a.t - b.t).map((point) => point.id),
      )
    }
    if (boundary.length === 3) indices.push(...boundary)
    else {
      const center = positions.length / 3
      for (let axis = 0; axis < 3; axis++)
        positions.push(
          ids.reduce((sum, id) => sum + mesh.positions[id * 3 + axis]!, 0) / 3,
        )
      for (let side = 0; side < boundary.length; side++)
        indices.push(
          center,
          boundary[side]!,
          boundary[(side + 1) % boundary.length]!,
        )
    }
  }
  return { positions, indices }
}
/** Closed rounded rectangular flat seal centered on XY, with mating face Z=0 and top Z=thickness. Width and height are outside XY extents; border is the straight-side setback of the inner opening. The inner corner radius is max(0, outer corner radius minus border), giving concentric rounded corners when the border is thinner than the radius and square inner corners otherwise. */
export function createRectangularGasketMesh(
  input: RectangularGasketModelPropsInput,
): RectangularGasketMesh {
  const p = rectangularGasketModelPropsSchema.parse(input),
    d = getRectangularGasketDimensions(p)
  if (
    Math.min(p.thickness, p.border, d.innerWidth, d.innerHeight) <=
    Math.max(...d.size) * 1e-10
  )
    throw new Error(
      "rectangulargasket dimensions exceed mesh resolution limits",
    )
  const rounded = (
    width: number,
    height: number,
    radius: number,
  ): ProfilePoint[] => {
    if (radius === 0)
      return [
        [-width / 2, -height / 2],
        [width / 2, -height / 2],
        [width / 2, height / 2],
        [-width / 2, height / 2],
      ]
    const points: ProfilePoint[] = []
    for (let corner = 0; corner < 4; corner++) {
      const x = (corner === 0 || corner === 3 ? 1 : -1) * (width / 2 - radius)
      const y = (corner < 2 ? 1 : -1) * (height / 2 - radius)
      for (let step = 0; step <= 32; step++) {
        const angle = (corner * Math.PI) / 2 + (step * Math.PI) / 64
        points.push([
          x + radius * Math.cos(angle),
          y + radius * Math.sin(angle),
        ])
      }
    }
    return points
  }
  return retainCapSeams(
    extrudePlanarProfile({
      outer: rounded(p.width, p.height, p.cornerRadius),
      holes: [rounded(d.innerWidth, d.innerHeight, d.innerCornerRadius)],
      start: d.bottomZ,
      end: d.topZ,
    }),
    Math.max(...d.size) * 1e-10,
  )
}
export function createRectangularGasketGeom(
  input: RectangularGasketModelPropsInput,
) {
  return indexedMeshToGeom3(createRectangularGasketMesh(input))
}
