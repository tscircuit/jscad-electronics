import earcut from "earcut"

type Point = { key: string; coordinates: [number, number, number] }
type Mesh = { positions: number[]; indices: number[] }

/** Clip triangles with shared edge intersections, then close the planar cuts. */
export function clipMeshToZRange(
  mesh: Mesh,
  lower: number,
  upper: number,
): Mesh {
  const originals: Point[] = []
  const tolerance = 32 * Number.EPSILON * (upper - lower)
  for (let index = 0; index < mesh.positions.length / 3; index++)
    originals.push({
      key: `v${index}`,
      coordinates: [
        mesh.positions[index * 3]!,
        mesh.positions[index * 3 + 1]!,
        Math.abs(mesh.positions[index * 3 + 2]! - lower) <= tolerance
          ? lower
          : Math.abs(mesh.positions[index * 3 + 2]! - upper) <= tolerance
            ? upper
            : mesh.positions[index * 3 + 2]!,
      ],
    })
  const intersections = new Map<string, Point>()
  const crossing = (a: Point, b: Point, plane: number) => {
    if (a.coordinates[2] === plane) return a
    if (b.coordinates[2] === plane) return b
    const [first, second] = a.key < b.key ? [a, b] : [b, a]
    const key = `${plane}:${first.key}:${second.key}`
    let point = intersections.get(key)
    if (!point) {
      const fraction =
        (plane - first.coordinates[2]) /
        (second.coordinates[2] - first.coordinates[2])
      point = {
        key,
        coordinates: [
          first.coordinates[0] +
            fraction * (second.coordinates[0] - first.coordinates[0]),
          first.coordinates[1] +
            fraction * (second.coordinates[1] - first.coordinates[1]),
          plane,
        ],
      }
      intersections.set(key, point)
    }
    return point
  }
  const clip = (polygon: Point[], plane: number, keepAbove: boolean) => {
    const result: Point[] = []
    const inside = (point: Point) =>
      keepAbove ? point.coordinates[2] >= plane : point.coordinates[2] <= plane
    for (let index = 0; index < polygon.length; index++) {
      const a = polygon[index]!
      const b = polygon[(index + 1) % polygon.length]!
      if (inside(a)) result.push(a)
      if (inside(a) !== inside(b)) result.push(crossing(a, b, plane))
    }
    return result.filter(
      (point, index) =>
        point.key !== result[(index + result.length - 1) % result.length]?.key,
    )
  }
  const positions: number[] = []
  const indices: number[] = []
  const pointIndices = new Map<string, number>()
  const vertex = (point: Point) => {
    let index = pointIndices.get(point.key)
    if (index === undefined) {
      index = positions.length / 3
      positions.push(...point.coordinates)
      pointIndices.set(point.key, index)
    }
    return index
  }
  for (let index = 0; index < mesh.indices.length; index += 3) {
    const triangle = mesh.indices
      .slice(index, index + 3)
      .map((i) => originals[i]!)
    const polygon = clip(clip(triangle, lower, true), upper, false)
    for (let corner = 1; corner + 1 < polygon.length; corner++) {
      const points = [polygon[0]!, polygon[corner]!, polygon[corner + 1]!]
      if (new Set(points.map((point) => point.key)).size === 3)
        indices.push(...points.map(vertex))
    }
  }

  const edges = new Map<string, { from: number; to: number; count: number }>()
  for (let index = 0; index < indices.length; index += 3)
    for (let side = 0; side < 3; side++) {
      const from = indices[index + side]!
      const to = indices[index + ((side + 1) % 3)]!
      const key = `${Math.min(from, to)},${Math.max(from, to)}`
      const prior = edges.get(key)
      if (prior) prior.count++
      else edges.set(key, { from, to, count: 1 })
    }
  const boundary = [...edges.values()].filter((edge) => edge.count === 1)
  const outgoing = new Map(boundary.map(({ from, to }) => [from, to]))
  if (outgoing.size !== boundary.length)
    throw new Error("Ground clipping produced an ambiguous boundary")
  while (outgoing.size > 0) {
    const start = outgoing.keys().next().value!
    const loop: number[] = []
    let current = start
    do {
      loop.push(current)
      const next = outgoing.get(current)
      if (next === undefined)
        throw new Error("Ground clipping produced an open boundary")
      outgoing.delete(current)
      current = next
    } while (current !== start)
    const plane = positions[3 * start + 2]!
    if (
      (plane !== lower && plane !== upper) ||
      loop.some((i) => positions[3 * i + 2] !== plane)
    )
      throw new Error("Ground clipping boundary must lie on an end plane")
    const coordinates = loop.flatMap((i) => [
      positions[3 * i]!,
      positions[3 * i + 1]!,
    ])
    const cap = earcut(coordinates)
    for (let index = 0; index < cap.length; index += 3) {
      const a = loop[cap[index]!]!
      let b = loop[cap[index + 1]!]!
      let c = loop[cap[index + 2]!]!
      const cross =
        (positions[b * 3]! - positions[a * 3]!) *
          (positions[c * 3 + 1]! - positions[a * 3 + 1]!) -
        (positions[b * 3 + 1]! - positions[a * 3 + 1]!) *
          (positions[c * 3]! - positions[a * 3]!)
      if ((plane === lower && cross > 0) || (plane === upper && cross < 0))
        [b, c] = [c, b]
      indices.push(a, b, c)
    }
  }
  return { positions, indices }
}
