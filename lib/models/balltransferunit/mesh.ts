import {
  getBallTransferUnitDimensions,
  type BallTransferUnitModelPropsInput,
} from "@tscircuit/modelprinter"
import earcut from "earcut"
import {
  circularProfile,
  joinProfileMeshes,
  type ProfilePoint,
} from "../../mechanical/extrude-planar-profile"

type Mesh = { positions: number[]; indices: number[] }
type SectionPoint = [radius: number, z: number]

export interface BallTransferUnitMeshPart {
  name: "housing" | "load ball"
  color: string
  mesh: Mesh
}

export interface BallTransferUnitMesh extends Mesh {
  parts: BallTransferUnitMeshPart[]
}

/** Millimeters; body bottom at Z=0, circular mounting flange at the cup mouth.
 * The load ball and the perforated cup are independently closed physical parts.
 * Internal recirculation details are nominally represented by the socket.
 */
export function createBallTransferUnitMesh(
  input: BallTransferUnitModelPropsInput = {},
): BallTransferUnitMesh {
  const d = getBallTransferUnitDimensions(input)
  const lengths = [
    d.height,
    d.flangeDiameter,
    d.flangeThickness,
    d.flangeBottomZ,
    d.ballRadius,
    d.ballProtrusion,
    d.openingRadius,
    d.holeDiameter,
    d.socketBottomZ,
    d.bodyRadius - d.socketRadius,
    (d.pitchCircleDiameter - d.holeDiameter - d.bodyDiameter) / 2,
    (d.flangeDiameter - d.pitchCircleDiameter - d.holeDiameter) / 2,
  ]
  const largest = Math.max(...lengths)
  const resolution = Math.max(1e-5, largest * 1e-7)
  if (
    !lengths.every(Number.isFinite) ||
    largest > 1e6 ||
    Math.min(...lengths) < resolution
  )
    throw new Error(
      "Ball transfer unit exceeds the renderer's numerical resolution",
    )

  const segments = 96
  const latitude = 48
  const profile: SectionPoint[] = [
    [d.bodyRadius, 0],
    [d.bodyRadius, d.flangeBottomZ],
    [d.flangeRadius, d.flangeBottomZ],
    [d.flangeRadius, d.bodyHeight],
    [d.openingRadius, d.bodyHeight],
  ]
  const openingAngle = Math.acos(
    (d.bodyHeight - d.ballCenterZ) / d.socketRadius,
  )
  // Match the sphere's latitude samples. Zero clearance then preserves nominal
  // contact without an unrelated cup tessellation crossing the rolling ball.
  for (let j = 1; j < latitude; j++) {
    const angle = (j * Math.PI) / latitude
    // An aperture on an exact latitude can differ by one rounding bit after
    // acos. Omit samples indistinguishable from the already-authored mouth.
    if ((angle - openingAngle) * d.socketRadius > resolution)
      profile.push([
        d.socketRadius * Math.sin(angle),
        d.ballCenterZ + d.socketRadius * Math.cos(angle),
      ])
  }
  profile.push([0, d.socketBottomZ], [0, 0])

  const holes = d.mountingHoles.map(({ x, y, diameter }) =>
    circularProfile(x, y, diameter / 2, segments),
  )
  const flangeOutline = circularProfile(0, 0, d.flangeRadius, segments)
  const housing = joinProfileMeshes([
    // Cap faces are triangulated with all openings, rather than covered by
    // annular triangles and repaired afterward with Boolean subtraction.
    revolve(profile, segments, new Set([1, 3])),
    cap(
      flangeOutline,
      [circularProfile(0, 0, d.bodyRadius, segments), ...holes],
      d.flangeBottomZ,
      true,
    ),
    cap(
      flangeOutline,
      [circularProfile(0, 0, d.openingRadius, segments), ...holes],
      d.bodyHeight,
      false,
    ),
    ...holes.map((hole) => holeWall(hole, d.flangeBottomZ, d.bodyHeight)),
  ])
  const ball = revolve(
    Array.from({ length: latitude + 1 }, (_, j): SectionPoint => {
      // South to north yields outward winding. Each pole is a single vertex.
      const angle = Math.PI - (j * Math.PI) / latitude
      return [
        j === 0 || j === latitude ? 0 : d.ballRadius * Math.sin(angle),
        d.ballCenterZ + d.ballRadius * Math.cos(angle),
      ]
    }),
    segments,
  )
  const parts: BallTransferUnitMeshPart[] = [
    { name: "housing", color: "#9da4ac", mesh: housing },
    { name: "load ball", color: "#d5d9df", mesh: ball },
  ]
  const positions = [...housing.positions, ...ball.positions]
  const offset = housing.positions.length / 3
  const indices = [
    ...housing.indices,
    ...ball.indices.map((index) => index + offset),
  ]
  return { positions, indices, parts }
}

/** Revolve a counterclockwise section, retaining one vertex at each axis pole. */
function revolve(
  profile: SectionPoint[],
  segments: number,
  omittedEdges = new Set<number>(),
): Mesh {
  const positions: number[] = []
  const indices: number[] = []
  const rings = profile.map(([radius, z]) => {
    const start = positions.length / 3
    const count = radius === 0 ? 1 : segments
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / segments
      positions.push(radius * Math.cos(angle), radius * Math.sin(angle), z)
    }
    return { start, count }
  })
  for (let j = 0; j < rings.length; j++) {
    if (omittedEdges.has(j)) continue
    const a = rings[j]!
    const b = rings[(j + 1) % rings.length]!
    if (a.count === 1 && b.count === 1) continue
    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments
      if (a.count === 1) indices.push(a.start, b.start + next, b.start + i)
      else if (b.count === 1) indices.push(a.start + i, a.start + next, b.start)
      else
        indices.push(
          a.start + i,
          a.start + next,
          b.start + next,
          a.start + i,
          b.start + next,
          b.start + i,
        )
    }
  }
  return { positions, indices }
}

function cap(
  outer: ProfilePoint[],
  holes: ProfilePoint[][],
  z: number,
  reverse: boolean,
): Mesh {
  const loops = [outer, ...holes]
  const starts: number[] = []
  let count = outer.length
  for (const hole of holes) {
    starts.push(count)
    count += hole.length
  }
  const points = loops.flat()
  const indices = earcut(points.flat(), starts)
  if (reverse)
    for (let i = 0; i < indices.length; i += 3)
      [indices[i + 1], indices[i + 2]] = [indices[i + 2]!, indices[i + 1]!]
  return { positions: points.flatMap(([x, y]) => [x, y, z]), indices }
}

function holeWall(loop: ProfilePoint[], bottom: number, top: number): Mesh {
  const positions = [bottom, top].flatMap((z) =>
    loop.flatMap(([x, y]) => [x, y, z]),
  )
  const indices: number[] = []
  const count = loop.length
  for (let i = 0; i < count; i++) {
    const next = (i + 1) % count
    indices.push(i, next + count, next, i, i + count, next + count)
  }
  return { positions, indices }
}
