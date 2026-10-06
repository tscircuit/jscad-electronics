import earcut from "earcut"

export type ProfilePoint = [number, number]
export type ProfileMesh = { positions: number[]; indices: number[] }
type Point3 = [number, number, number]

/** Triangulate a planar outline with through openings, preserving shared
 * indexed vertices and opposite edge winding. Omitted walls permit adjoining
 * straight and curved panels to be sewn without internal seam faces.
 */
export function extrudePlanarProfile({
  outer,
  holes = [],
  start,
  end,
  project = (u, v, depth) => [u, v, depth],
  reverse = false,
  skipWall = () => false,
}: {
  outer: ProfilePoint[]
  holes?: ProfilePoint[][]
  start: number
  end: number
  project?: (u: number, v: number, depth: number) => Point3
  reverse?: boolean
  skipWall?: (a: ProfilePoint, b: ProfilePoint) => boolean
}): ProfileMesh {
  const oriented = (loop: ProfilePoint[], clockwise: boolean) => {
    loop = loop.filter((point, index) => {
      const previous = loop[(index + loop.length - 1) % loop.length]!
      return point[0] !== previous[0] || point[1] !== previous[1]
    })
    const area = loop.reduce((sum, a, index) => {
      const b = loop[(index + 1) % loop.length]!
      return sum + a[0] * b[1] - a[1] * b[0]
    }, 0)
    if (!Number.isFinite(area) || area === 0)
      throw new Error("Profile exceeds mesh resolution limits")
    return area < 0 === clockwise ? loop : [...loop].reverse()
  }
  const loops = [oriented(outer, false), ...holes.map((h) => oriented(h, true))]
  const points = loops.flat()
  const holeStarts: number[] = []
  let count = loops[0]!.length
  for (const hole of loops.slice(1)) {
    holeStarts.push(count)
    count += hole.length
  }
  const faces = earcut(points.flat(), holeStarts)
  const positions = [start, end].flatMap((depth) =>
    points.flatMap(([u, v]) => project(u, v, depth)),
  )
  const indices: number[] = []
  for (let i = 0; i < faces.length; i += 3) {
    const [a, b, c] = faces.slice(i, i + 3) as [number, number, number]
    indices.push(a, c, b, a + count, b + count, c + count)
  }
  let offset = 0
  for (const [loopIndex, loop] of loops.entries()) {
    for (let i = 0; i < loop.length; i++) {
      const next = (i + 1) % loop.length
      if (loopIndex === 0 && skipWall(loop[i]!, loop[next]!)) continue
      const a = offset + i
      const b = offset + next
      indices.push(a, b, b + count, a, b + count, a + count)
    }
    offset += loop.length
  }
  if (reverse)
    for (let i = 0; i < indices.length; i += 3)
      [indices[i + 1], indices[i + 2]] = [indices[i + 2]!, indices[i + 1]!]
  return { positions, indices }
}

/** Reuse seam vertices after joining independently triangulated panels. */
export function joinProfileMeshes(meshes: ProfileMesh[]): ProfileMesh {
  const positions: number[] = []
  const indices: number[] = []
  const vertices = new Map<string, number>()
  for (const mesh of meshes) {
    for (const index of mesh.indices) {
      const point = mesh.positions.slice(index * 3, index * 3 + 3)
      const key = point.map((value) => value.toFixed(12)).join(",")
      let shared = vertices.get(key)
      if (shared === undefined) {
        shared = positions.length / 3
        vertices.set(key, shared)
        positions.push(...point)
      }
      indices.push(shared)
    }
  }
  return { positions, indices }
}

export function circularProfile(
  x: number,
  y: number,
  radius: number,
  segments = 96,
): ProfilePoint[] {
  return Array.from({ length: segments }, (_, index) => {
    const angle = (index * 2 * Math.PI) / segments
    return [x + radius * Math.cos(angle), y + radius * Math.sin(angle)]
  })
}
