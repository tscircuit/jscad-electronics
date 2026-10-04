import type { CableFrame, CablePoint } from "./types"

export const add = (a: CablePoint, b: CablePoint): CablePoint => [
  a[0] + b[0],
  a[1] + b[1],
  a[2] + b[2],
]
export const subtract = (a: CablePoint, b: CablePoint): CablePoint => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
]
export const scale = (point: CablePoint, factor: number): CablePoint => [
  point[0] * factor,
  point[1] * factor,
  point[2] * factor,
]
export const dot = (a: CablePoint, b: CablePoint) =>
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const cross = (a: CablePoint, b: CablePoint): CablePoint => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
export function normalize(point: CablePoint): CablePoint {
  const length = Math.hypot(...point)
  if (length < 1e-10)
    throw new Error(
      "Cable path must not contain coincident points or a reversing tangent",
    )
  return scale(point, 1 / length)
}

/** Parallel transport avoids a wire bundle flipping when its tangent crosses an axis. */
export function createCablePathFrames(path: CablePoint[]): CableFrame[] {
  if (
    path.length < 2 ||
    path.some((point) => point.length !== 3 || !point.every(Number.isFinite))
  ) {
    throw new Error("Cable path needs at least two finite 3D points")
  }
  const segments = path
    .slice(1)
    .map((point, index) => normalize(subtract(point, path[index]!)))
  const tangents = path.map((_, index) =>
    index === 0
      ? segments[0]!
      : index === path.length - 1
        ? segments.at(-1)!
        : normalize(add(segments[index - 1]!, segments[index]!)),
  )
  const initialUp: CablePoint =
    Math.abs(tangents[0]![2]) > 0.95 ? [0, 1, 0] : [0, 0, 1]
  let normal = normalize(cross(initialUp, tangents[0]!))
  return tangents.map((tangent, index) => {
    if (index > 0) {
      const previousTangent = tangents[index - 1]!
      const axis = cross(previousTangent, tangent)
      const sine = Math.hypot(...axis)
      const cosine = Math.max(-1, Math.min(1, dot(previousTangent, tangent)))
      if (sine > 1e-10) {
        const unitAxis = scale(axis, 1 / sine)
        normal = normalize(
          add(
            add(scale(normal, cosine), scale(cross(unitAxis, normal), sine)),
            scale(unitAxis, dot(unitAxis, normal) * (1 - cosine)),
          ),
        )
      }
    }
    return {
      point: path[index]!,
      tangent,
      normal,
      binormal: normalize(cross(tangent, normal)),
    }
  })
}
