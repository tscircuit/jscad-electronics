type Mesh = { positions: number[]; indices: number[] }
type Point = [number, number, number]
const sub = (a: Point, b: Point): Point => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
]
const cross = (a: Point, b: Point): Point => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
const dot = (a: Point, b: Point) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** Independent triangle/ray intersections verify holes rather than trusting
 * the generator's feature outlines or vertex positions. Returns ray distances.
 */
export function raySurfaceHits(mesh: Mesh, origin: Point, direction: Point) {
  const hits: number[] = []
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const [a, b, c] = mesh.indices
      .slice(i, i + 3)
      .map(
        (index) => mesh.positions.slice(index * 3, index * 3 + 3) as Point,
      ) as [Point, Point, Point]
    const e1 = sub(b, a),
      e2 = sub(c, a),
      p = cross(direction, e2)
    const denominator = dot(e1, p)
    if (Math.abs(denominator) < 1e-10) continue
    const t = sub(origin, a),
      u = dot(t, p) / denominator
    if (u < -1e-8 || u > 1 + 1e-8) continue
    const q = cross(t, e1),
      v = dot(direction, q) / denominator
    if (v < -1e-8 || u + v > 1 + 1e-8) continue
    const distance = dot(e2, q) / denominator
    if (distance >= 0) hits.push(distance)
  }
  hits.sort((a, b) => a - b)
  return hits.filter(
    (value, index) => index === 0 || Math.abs(value - hits[index - 1]!) > 1e-7,
  )
}
