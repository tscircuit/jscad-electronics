import {
  timingPulleyModelPropsSchema,
  getTimingPulleyDimensions,
  type TimingPulleyModelPropsInput,
} from "@tscircuit/modelprinter"
export type TimingPulleyMesh = { positions: number[]; indices: number[] }
export type TimingPulleyMeshOptions = {
  arcSegments?: number
  crestSegments?: number
}
type Point = [number, number]
function resolution(options: TimingPulleyMeshOptions) {
  const arcSegments = options.arcSegments ?? 8,
    crestSegments = options.crestSegments ?? 4
  if (
    !Number.isInteger(arcSegments) ||
    arcSegments < 4 ||
    arcSegments > 32 ||
    !Number.isInteger(crestSegments) ||
    crestSegments < 2 ||
    crestSegments > 16
  )
    throw new Error(
      "Pulley resolution requires arcSegments 4..32 and crestSegments 2..16",
    )
  return { arcSegments, crestSegments }
}
/** Closed counterclockwise boundary; straight flanks and tangent fillets are explicit. */
export function createTimingPulleyOutline(
  input: TimingPulleyModelPropsInput = {},
  options: TimingPulleyMeshOptions = {},
): Point[] {
  const p = timingPulleyModelPropsSchema.parse(input),
    d = getTimingPulleyDimensions(p)
  const { arcSegments, crestSegments } = resolution(options)
  const radius = d.outsideDiameter / 2,
    root = radius - d.grooveDepth
  const beta = (d.grooveAngle * Math.PI) / 360,
    k = Math.tan(beta),
    norm = Math.hypot(1, k)
  const intercept = d.grooveOpening / 2 - k * radius
  const rr = d.grooveRootRadius,
    re = d.grooveEntryRadius
  const rootCenter: Point = [intercept + k * (root + rr) - rr * norm, root + rr]
  const offset = intercept + re * norm
  const discriminant =
    (2 * k * offset) ** 2 -
    4 * (1 + k * k) * (offset * offset - (radius - re) ** 2)
  if (discriminant <= 0) throw new Error("Pulley entry fillet does not fit")
  const entryY = (-2 * k * offset + Math.sqrt(discriminant)) / (2 * (1 + k * k))
  const entryCenter: Point = [offset + k * entryY, entryY]
  const entryEnd = Math.atan2(entryCenter[1], entryCenter[0])
  const right: Point[] = []
  const arc = (
    center: Point,
    r: number,
    from: number,
    to: number,
    skipFirst = false,
  ) => {
    for (let i = skipFirst ? 1 : 0; i <= arcSegments; i++) {
      const a = from + ((to - from) * i) / arcSegments
      right.push([center[0] + r * Math.cos(a), center[1] + r * Math.sin(a)])
    }
  }
  arc(rootCenter, rr, -Math.PI / 2, -beta)
  const entryWall: Point = [
    entryCenter[0] - re / norm,
    entryCenter[1] + (re * k) / norm,
  ]
  right.push(entryWall)
  arc(entryCenter, re, Math.PI - beta, entryEnd, true)
  const groove: Point[] = [
    ...[...right].reverse().map(([x, y]): Point => [-x, y]),
    [0, root],
    ...right,
  ]
  const halfOpening = Math.atan2(right.at(-1)![0], right.at(-1)![1])
  if (rootCenter[0] <= 0 || halfOpening >= Math.PI / p.toothCount)
    throw new Error("Pulley grooves must leave positive root and crest lands")
  const outline: Point[] = []
  for (let tooth = 0; tooth < p.toothCount; tooth++) {
    const angle = tooth * d.toothPitchAngle
    for (const [x, y] of groove)
      outline.push([
        y * Math.cos(angle) - x * Math.sin(angle),
        y * Math.sin(angle) + x * Math.cos(angle),
      ])
    for (let i = 1; i < crestSegments; i++) {
      const a =
        angle +
        halfOpening +
        ((d.toothPitchAngle - 2 * halfOpening) * i) / crestSegments
      outline.push([radius * Math.cos(a), radius * Math.sin(a)])
    }
  }
  return outline
}
export function createTimingPulleyMesh(
  input: TimingPulleyModelPropsInput = {},
  options: TimingPulleyMeshOptions = {},
): TimingPulleyMesh {
  const p = timingPulleyModelPropsSchema.parse(input),
    d = getTimingPulleyDimensions(p)
  const outline = createTimingPulleyOutline(p, options)
  const scale = Math.max(d.flangeDiameter, d.totalWidth)
  if (
    Math.min(
      p.boreDiameter,
      (d.rootDiameter - p.boreDiameter) / 2,
      p.flangeThickness,
      p.sideClearance,
      p.beltWidth,
    ) <= Math.max(scale * 1e-9, 1e-7)
  )
    throw new Error(
      "Pulley features are below the supported numerical resolution",
    )
  const mesh: TimingPulleyMesh = { positions: [], indices: [] }
  const count = outline.length
  for (let ring = 0; ring < 8; ring++)
    for (const [x, y] of outline) {
      const angle = Math.atan2(y, x)
      const r =
        ring === 0 || ring === 7
          ? p.boreDiameter / 2
          : ring === 3 || ring === 4
            ? Math.hypot(x, y)
            : d.flangeDiameter / 2
      const z =
        ring < 2 ? d.minZ : ring < 4 ? 0 : ring < 6 ? d.faceWidth : d.maxZ
      mesh.positions.push(r * Math.cos(angle), r * Math.sin(angle), z)
    }
  for (let ring = 0; ring < 8; ring++)
    for (let i = 0; i < count; i++) {
      const j = (i + 1) % count,
        next = (ring + 1) % 8
      const a = ring * count + i,
        b = ring * count + j,
        c = next * count + j,
        e = next * count + i
      mesh.indices.push(a, b, c, a, c, e)
    }
  return mesh
}
