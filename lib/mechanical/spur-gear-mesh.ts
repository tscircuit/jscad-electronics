import {
  getSpurGearDimensions,
  spurGearModelPropsSchema,
  type SpurGearModelPropsInput,
} from "@tscircuit/modelprinter"
import earcut from "earcut"

/** Indexed triangles, counterclockwise from outside; millimeters, Z up. */
export interface SpurGearMesh {
  positions: number[]
  indices: number[]
}

type Point2 = [number, number]

/**
 * An external involute spur gear with its lower face at Z=0. Tooth centers
 * start on +X and rotate counterclockwise with phase. The optional hub extends
 * above the upper face, and the round bore passes through both gear and hub.
 * Flanks are sampled involutes; tips and root valleys follow circular arcs.
 * Below the base circle the flanks extend radially, without a generated
 * trochoidal root fillet or cutter undercut. No CSG or renderer is required.
 */
export function createSpurGearMesh(
  input: SpurGearModelPropsInput,
): SpurGearMesh {
  return createTwistedSpurGearMesh(input)
}

/** Shared transverse involute extrusion; twist is signed radians over the face. */
export function createTwistedSpurGearMesh(
  input: SpurGearModelPropsInput,
  twist = 0,
  segmentsPerTurn = 32,
): SpurGearMesh {
  const props = spurGearModelPropsSchema.parse(input)
  const dimensions = getSpurGearDimensions(props)
  const pitchRadius = dimensions.pitchDiameter / 2
  const baseRadius = dimensions.baseDiameter / 2
  const outsideRadius = dimensions.outsideDiameter / 2
  const rootRadius = dimensions.rootDiameter / 2
  const pressureAngle = (props.pressureAngle * Math.PI) / 180
  const toothAngle = (Math.PI * 2) / props.toothCount
  const phase = (((props.phase % 360) + 360) % 360) * (Math.PI / 180)
  const baseHalfAngle =
    dimensions.toothThickness / (2 * pitchRadius) +
    Math.tan(pressureAngle) -
    pressureAngle
  // Involute parameter t gives radius rb*sqrt(1+t^2) and angular roll
  // t-atan(t). Sampling t avoids an arbitrary polygonal tooth approximation.
  const startRadius = Math.max(baseRadius, rootRadius)
  const startT = Math.sqrt(Math.max(0, (startRadius / baseRadius) ** 2 - 1))
  const outsideT = Math.sqrt((outsideRadius / baseRadius) ** 2 - 1)
  const halfAngle = (t: number) => baseHalfAngle - (t - Math.atan(t))
  const rootHalfAngle = halfAngle(startT)
  const tipHalfAngle = halfAngle(outsideT)
  const flankSteps = Math.max(2, Math.ceil(props.segmentsPerTooth / 2))
  const arcSteps = Math.max(1, Math.ceil(props.segmentsPerTooth / 4))
  const rootValleyAngle = toothAngle - 2 * rootHalfAngle
  const innerRadius = Math.max(props.boreDiameter, props.hubDiameter) / 2
  // A root arc's chord lies inside its analytic circle. Refine that arc when
  // a bore or hub almost fills the root, so the cap loops remain disjoint.
  const safeRootStep =
    innerRadius > 0
      ? (twist === 0 ? 1.8 : 0.8) * Math.acos(innerRadius / rootRadius)
      : Math.PI
  const rootArcSteps = Math.max(
    arcSteps,
    Math.ceil(rootValleyAngle / safeRootStep),
  )
  // Sample at least sixteen layers per tooth of twist, and refine near a bore
  // or hub so even the triangles between layers stay outside the inner loop.
  const twistStep = Math.min(
    toothAngle / 16,
    (2 * Math.PI) / segmentsPerTurn,
    safeRootStep,
  )
  const layers = Math.max(1, Math.ceil(Math.abs(twist) / twistStep))
  const pointsPerTooth =
    2 * flankSteps + arcSteps + rootArcSteps + (rootRadius < baseRadius ? 2 : 0)
  if (
    !Number.isFinite(rootArcSteps) ||
    !Number.isFinite(layers) ||
    (layers + 1) * props.toothCount * pointsPerTooth + 1024 > 1_000_000
  )
    throw new Error(
      "Involute gear exceeds mesh resolution limit (1 million vertices); reduce twist or resolution, or increase bore/hub wall thickness",
    )
  const outline: Point2[] = []
  const polar = (radius: number, angle: number) => {
    outline.push([radius * Math.cos(angle), radius * Math.sin(angle)])
  }

  for (let tooth = 0; tooth < props.toothCount; tooth++) {
    const center = phase + tooth * toothAngle
    polar(rootRadius, center - rootHalfAngle)
    if (rootRadius < baseRadius) polar(baseRadius, center - baseHalfAngle)
    for (let step = 1; step <= flankSteps; step++) {
      const t = startT + ((outsideT - startT) * step) / flankSteps
      polar(baseRadius * Math.sqrt(1 + t * t), center - halfAngle(t))
    }
    for (let step = 1; step <= arcSteps; step++)
      polar(
        outsideRadius,
        center - tipHalfAngle + (2 * tipHalfAngle * step) / arcSteps,
      )
    for (let step = flankSteps - 1; step >= 0; step--) {
      const t = startT + ((outsideT - startT) * step) / flankSteps
      polar(baseRadius * Math.sqrt(1 + t * t), center + halfAngle(t))
    }
    if (rootRadius < baseRadius) polar(rootRadius, center + baseHalfAngle)
    // The next tooth adds the final valley point, avoiding repeated vertices.
    for (let step = 1; step < rootArcSteps; step++)
      polar(
        rootRadius,
        center + rootHalfAngle + (rootValleyAngle * step) / rootArcSteps,
      )
  }

  const positions: number[] = []
  const indices: number[] = []
  const ring = (points: Point2[], z: number) => {
    const start = positions.length / 3
    for (const [x, y] of points) positions.push(x, y, z)
    return start
  }
  const circleSegments = Math.max(48, Math.min(256, props.toothCount * 4))
  const circle = (radius: number): Point2[] =>
    Array.from({ length: circleSegments }, (_, segment) => {
      const angle = phase + (segment * Math.PI * 2) / circleSegments
      return [radius * Math.cos(angle), radius * Math.sin(angle)]
    })
  const connect = (
    bottom: number,
    top: number,
    count: number,
    inward = false,
  ) => {
    for (let i = 0; i < count; i++) {
      const next = (i + 1) % count
      if (inward)
        indices.push(
          bottom + i,
          top + next,
          bottom + next,
          bottom + i,
          top + i,
          top + next,
        )
      else
        indices.push(
          bottom + i,
          bottom + next,
          top + next,
          bottom + i,
          top + next,
          top + i,
        )
    }
  }
  const cap = (
    outer: Point2[],
    outerStart: number,
    upward: boolean,
    inner?: { points: Point2[]; start: number },
  ) => {
    const points = inner ? [...outer, ...inner.points] : outer
    const triangles = earcut(
      points.flatMap(([x, y]) => [x, y]),
      inner ? [outer.length] : [],
    )
    const vertex = (index: number) =>
      index < outer.length
        ? outerStart + index
        : inner!.start + index - outer.length
    for (let i = 0; i < triangles.length; i += 3) {
      const a = triangles[i]!
      const b = triangles[i + 1]!
      const c = triangles[i + 2]!
      const pa = points[a]!
      const pb = points[b]!
      const pc = points[c]!
      const area =
        (pb[0] - pa[0]) * (pc[1] - pa[1]) - (pb[1] - pa[1]) * (pc[0] - pa[0])
      if (area > 0 === upward) indices.push(vertex(a), vertex(b), vertex(c))
      else indices.push(vertex(a), vertex(c), vertex(b))
    }
  }

  const bottom = ring(outline, 0)
  let top = bottom
  let topOutline = outline
  for (let layer = 1; layer <= layers; layer++) {
    const angle = twist * (layer / layers)
    topOutline =
      twist === 0
        ? outline
        : outline.map(
            ([x, y]): Point2 => [
              x * Math.cos(angle) - y * Math.sin(angle),
              x * Math.sin(angle) + y * Math.cos(angle),
            ],
          )
    const next = ring(topOutline, props.faceWidth * (layer / layers))
    connect(top, next, outline.length)
    top = next
  }
  const hasHub = props.hubDiameter > 0 && props.hubLength > 0
  const height = props.faceWidth + (hasHub ? props.hubLength : 0)
  const bore =
    props.boreDiameter > 0 ? circle(props.boreDiameter / 2) : undefined
  const boreBottom = bore ? ring(bore, 0) : undefined
  const boreTop = bore ? ring(bore, height) : undefined
  if (bore) connect(boreBottom!, boreTop!, bore.length, true)
  cap(
    outline,
    bottom,
    false,
    bore ? { points: bore, start: boreBottom! } : undefined,
  )
  if (hasHub) {
    const hub = circle(props.hubDiameter / 2)
    const hubBottom = ring(hub, props.faceWidth)
    const hubTop = ring(hub, height)
    cap(topOutline, top, true, { points: hub, start: hubBottom })
    connect(hubBottom, hubTop, hub.length)
    // Both circular loops use identical angular samples. Direct annular
    // triangles avoid collinear bridge triangles in polygon triangulation.
    if (bore) connect(hubTop, boreTop!, hub.length)
    else cap(hub, hubTop, true)
  } else
    cap(
      topOutline,
      top,
      true,
      bore ? { points: bore, start: boreTop! } : undefined,
    )
  return { positions, indices }
}
