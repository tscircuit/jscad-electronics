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

/** Pin 1 sides point from the connector center toward its first contact
 * (connector-local -X), expressed as directions (no
 * translation) in right-handed world XYZ, +Z up. Path points are mm in that
 * same frame. Parallel transport preserves legacy roll when no directions
 * are supplied; two constrained ends distribute twist by path arc length.
 */
export function createCablePathFrames(
  path: CablePoint[],
  {
    startPin1Side,
    endPin1Side,
  }: {
    startPin1Side?: CablePoint
    endPin1Side?: CablePoint
  } = {},
): CableFrame[] {
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
  const endpointNormal = (pin1Side: CablePoint, tangent: CablePoint) => {
    if (
      pin1Side.length !== 3 ||
      !pin1Side.every(Number.isFinite) ||
      Math.hypot(...pin1Side) < 1e-10
    )
      throw new Error("Connector pin 1 side must be a finite nonzero vector")
    const normal = scale(normalize(pin1Side), -1)
    if (Math.abs(dot(normal, tangent)) > 1e-5)
      throw new Error(
        "Connector pin 1 side must be perpendicular to its path tangent",
      )
    return normalize(subtract(normal, scale(tangent, dot(normal, tangent))))
  }
  let normal = startPin1Side
    ? endpointNormal(startPin1Side, tangents[0]!)
    : normalize(cross(initialUp, tangents[0]!))
  const frames = tangents.map((tangent, index) => {
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
  if (!endPin1Side) return frames
  const last = frames.at(-1)!
  const endNormal = endpointNormal(endPin1Side, last.tangent)
  const twist = Math.atan2(
    dot(last.tangent, cross(last.normal, endNormal)),
    dot(last.normal, endNormal),
  )
  const distances = [0]
  for (let index = 1; index < path.length; index++)
    distances.push(
      distances[index - 1]! +
        Math.hypot(...subtract(path[index]!, path[index - 1]!)),
    )
  return frames.map((frame, index) => {
    const angle =
      twist * (startPin1Side ? distances[index]! / distances.at(-1)! : 1)
    const normal = normalize(
      add(
        scale(frame.normal, Math.cos(angle)),
        scale(frame.binormal, Math.sin(angle)),
      ),
    )
    return {
      ...frame,
      normal,
      binormal: normalize(cross(frame.tangent, normal)),
    }
  })
}
