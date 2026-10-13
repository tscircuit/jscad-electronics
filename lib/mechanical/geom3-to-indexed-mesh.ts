import jscad from "@jscad/modeling"

export type IndustrialIndexedMesh = { positions: number[]; indices: number[] }
type Point = [number, number, number]
type Triangle = [number, number, number]
const edgeKey = (a: number, b: number) => (a < b ? `${a},${b}` : `${b},${a}`)

/**
 * Export edge-conforming indexed triangles from a JSCAD solid. Snapping can
 * move a T-junction vertex slightly off its neighboring long edge, beyond
 * JSCAD's fixed insertion tolerance. Preserve those boundary subdivisions
 * instead of leaving a triangle edge spanning the middle vertex.
 */
export function geom3ToIndexedMesh(
  input: jscad.geometries.geom3.Geom3,
): IndustrialIndexedMesh {
  const generalize = jscad.modifiers.generalize as unknown as (
    options: { snap: boolean; triangulate: boolean },
    geometry: jscad.geometries.geom3.Geom3,
  ) => jscad.geometries.geom3.Geom3
  const inputExtent = Math.max(...jscad.measurements.measureDimensions(input))
  if (!Number.isFinite(inputExtent) || inputExtent <= 0)
    throw new Error("Expected finite nonempty geometry")
  const weldTolerance = Math.max(inputExtent * 1e-10, 1e-12)
  const cells = new Map<string, Point[]>()
  const weld = (v: readonly number[]): Point => {
    if (v.length !== 3 || v.some((value) => !Number.isFinite(value)))
      throw new Error("Expected finite mesh coordinates")
    const cell = v.map((value) => Math.floor(value / weldTolerance))
    // Check neighboring cells so a floating-point rounding boundary cannot
    // send theoretically identical boolean vertices to opposite snap cells.
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) {
          const entries = cells.get(
            `${cell[0]! + x},${cell[1]! + y},${cell[2]! + z}`,
          )
          const existing = entries?.find(
            (point) =>
              Math.hypot(...v.map((value, axis) => value - point[axis]!)) <=
              weldTolerance,
          )
          if (existing) return existing
        }
    const point: Point = [v[0]!, v[1]!, v[2]!],
      key = cell.join(","),
      entries = cells.get(key)
    if (entries) entries.push(point)
    else cells.set(key, [point])
    return point
  }
  const welded = jscad.geometries.geom3.fromPoints(
    jscad.geometries.geom3
      .toPolygons(input)
      .map((poly) => poly.vertices.map(weld)),
  )
  const geom = generalize({ snap: true, triangulate: true }, welded)
  const extent = Math.max(...jscad.measurements.measureDimensions(geom))
  if (!Number.isFinite(extent) || extent <= 0)
    throw new Error("Expected finite nonempty geometry")
  const epsilon = Math.max(extent * 1e-10, 1e-12)
  // Coordinate welding remains fine grained. The larger snap tolerance is used
  // only to find missing vertices on unmatched triangle boundary edges.
  const snapTolerance = Math.max(
    2 * jscad.measurements.measureEpsilon(geom),
    epsilon,
  )
  const positions: number[] = [],
    indices: number[] = []
  const lookup = new Map<string, number>()
  const point = (index: number): Point => [
    positions[index * 3]!,
    positions[index * 3 + 1]!,
    positions[index * 3 + 2]!,
  ]
  const vertex = (v: readonly number[]) => {
    if (v.length !== 3 || v.some((value) => !Number.isFinite(value)))
      throw new Error("Expected finite mesh coordinates")
    const key = v.map((x) => Math.round(x / epsilon)).join(",")
    let index = lookup.get(key)
    if (index === undefined) {
      index = positions.length / 3
      positions.push(...v)
      lookup.set(key, index)
    }
    return index
  }
  const area = ([a, b, c]: Triangle) => {
    const pa = point(a),
      pb = point(b),
      pc = point(c)
    const u = pb.map((x, i) => x - pa[i]!),
      v = pc.map((x, i) => x - pa[i]!)
    return Math.hypot(
      u[1]! * v[2]! - u[2]! * v[1]!,
      u[2]! * v[0]! - u[0]! * v[2]!,
      u[0]! * v[1]! - u[1]! * v[0]!,
    )
  }
  const triangles: Triangle[] = []
  const edges = new Map<string, { a: number; b: number; count: number }>()
  for (const poly of jscad.geometries.geom3.toPolygons(geom)) {
    for (let i = 1; i < poly.vertices.length - 1; i++) {
      const triangle: Triangle = [
        vertex(poly.vertices[0]!),
        vertex(poly.vertices[i]!),
        vertex(poly.vertices[i + 1]!),
      ]
      if (area(triangle) <= epsilon * epsilon) continue
      triangles.push(triangle)
      triangle.forEach((a, i) => {
        const b = triangle[(i + 1) % 3]!,
          key = edgeKey(a, b),
          entry = edges.get(key)
        if (entry) entry.count++
        else edges.set(key, { a, b, count: 1 })
      })
    }
  }
  const unmatched = [...edges.values()].filter(({ count }) => count === 1)
  const candidates = [...new Set(unmatched.flatMap(({ a, b }) => [a, b]))]
  // Sort candidates on each axis, so a short boundary edge only examines the
  // vertices in its interval rather than scanning every vertex in the model.
  const sorted = [0, 1, 2].map((axis) =>
    [...candidates].sort(
      (a, b) => positions[a * 3 + axis]! - positions[b * 3 + axis]!,
    ),
  )
  const subdivisions = new Map<string, number[]>()
  for (const { a, b } of unmatched) {
    const pa = point(a),
      pb = point(b),
      direction = pb.map((x, i) => x - pa[i]!),
      length = Math.hypot(...direction)
    if (length <= epsilon) continue
    const axis = direction.reduce(
      (best, x, i) => (Math.abs(x) > Math.abs(direction[best]!) ? i : best),
      0,
    )
    const unit = direction.map((x) => x / length),
      low = Math.min(pa[axis]!, pb[axis]!),
      high = Math.max(pa[axis]!, pb[axis]!)
    const byAxis = sorted[axis]!
    let left = 0,
      right = byAxis.length
    while (left < right) {
      const mid = (left + right) >>> 1
      if (positions[byAxis[mid]! * 3 + axis]! < low) left = mid + 1
      else right = mid
    }
    const splits: { index: number; t: number }[] = []
    for (let i = left; i < byAxis.length; i++) {
      const index = byAxis[i]!,
        p = point(index)
      if (p[axis]! > high) break
      if (index === a || index === b) continue
      const delta = p.map((x, j) => x - pa[j]!),
        along = delta.reduce((sum, x, j) => sum + x * unit[j]!, 0)
      if (along <= epsilon || along >= length - epsilon) continue
      const distance = Math.hypot(...delta.map((x, j) => x - along * unit[j]!))
      if (distance <= snapTolerance) splits.push({ index, t: along / length })
    }
    if (splits.length)
      subdivisions.set(
        edgeKey(a, b),
        splits.sort((x, y) => x.t - y.t).map(({ index }) => index),
      )
  }
  for (const triangle of triangles) {
    const boundary = triangle.flatMap((a, i) => {
      const b = triangle[(i + 1) % 3]!,
        splits = subdivisions.get(edgeKey(a, b))
      if (!splits) return [a]
      // Stored order follows the original edge direction; reverse for an edge
      // encountered in the other direction on an adjacent triangle.
      const edge = edges.get(edgeKey(a, b))!
      return [a, ...(edge.a === a ? splits : [...splits].reverse())]
    })
    if (boundary.length === 3) {
      indices.push(...triangle)
      continue
    }
    // A convex triangle with subdivided edges is safely fanned about an interior
    // point, preserving each short boundary edge instead of discarding a
    // collinear vertex through another diagonal triangulation.
    const origin = point(boundary[0]!)
    const center = origin.map(
      (value, axis) =>
        value +
        boundary.reduce(
          (sum, index) => sum + (point(index)[axis]! - value) / boundary.length,
          0,
        ),
    )
    const middle = vertex(center)
    for (let i = 0; i < boundary.length; i++) {
      const part: Triangle = [
        middle,
        boundary[i]!,
        boundary[(i + 1) % boundary.length]!,
      ]
      if (area(part) <= epsilon * epsilon)
        throw new Error("Unable to preserve a degenerate mesh boundary")
      indices.push(...part)
    }
  }
  // Remove vertices used only by discarded zero-area faces.
  const compactPositions: number[] = [],
    compactIndices: number[] = [],
    remap = new Map<number, number>()
  for (const original of indices) {
    let index = remap.get(original)
    if (index === undefined) {
      index = compactPositions.length / 3
      compactPositions.push(...point(original))
      remap.set(original, index)
    }
    compactIndices.push(index)
  }
  if (!compactIndices.length)
    throw new Error("Expected finite nonempty geometry")
  return { positions: compactPositions, indices: compactIndices }
}
