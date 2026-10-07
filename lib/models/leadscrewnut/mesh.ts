import earcut from "earcut"
import {
  leadScrewNutModelPropsSchema,
  getLeadScrewNutDimensions,
  type LeadScrewNutModelPropsInput,
} from "@tscircuit/modelprinter"
export interface LeadScrewNutMesh {
  positions: number[]
  indices: number[]
}
export interface LeadScrewNutMeshOptions {
  radialSegments?: number
  segmentsPerPitch?: number
  holeSegments?: number
}
function resolution(options: LeadScrewNutMeshOptions) {
  const radial = options.radialSegments ?? 96,
    axial = options.segmentsPerPitch ?? 24,
    holes = options.holeSegments ?? 32
  if (
    !Number.isInteger(radial) ||
    radial < 32 ||
    radial > 192 ||
    radial % 16 !== 0 ||
    !Number.isInteger(axial) ||
    axial < 8 ||
    axial > 64 ||
    !Number.isInteger(holes) ||
    holes < 16 ||
    holes > 96 ||
    holes % 4 !== 0
  )
    throw new Error(
      "Mesh resolution limit: radial multiple of 16 in [32,192], pitch integer in [8,64], hole multiple of 4 in [16,96]",
    )
  return { radial, axial, holes }
}
/** Watertight annular female helix with independently dimensioned flange and axial mounting bores. */
export function createLeadScrewNutMesh(
  input: LeadScrewNutModelPropsInput,
  options: LeadScrewNutMeshOptions = {},
): LeadScrewNutMesh {
  const props = leadScrewNutModelPropsSchema.parse(input),
    d = getLeadScrewNutDimensions(input)
  const { radial, axial, holes } = resolution(options)
  const steps = Math.ceil((d.length / d.threadPitch) * axial)
  if (
    !Number.isFinite(steps) ||
    steps > 12000 ||
    (steps + 3) * radial > 1200000
  )
    throw new Error("Mesh resolution limit: excessive length/pitch")
  const positions: number[] = [],
    indices: number[] = []
  const ring = (
    z: number,
    radius: (a: number) => number,
    count = radial,
    x = 0,
    y = 0,
  ) => {
    const ids: number[] = []
    for (let i = 0; i < count; i++) {
      const a = (i * 2 * Math.PI) / count,
        r = radius(a)
      ids.push(positions.length / 3)
      positions.push(x + r * Math.cos(a), y + r * Math.sin(a), z)
    }
    return ids
  }
  const connect = (a: number[], b: number[], inward = false) => {
    for (let i = 0; i < a.length; i++) {
      const n = (i + 1) % a.length
      const tri = [a[i]!, a[n]!, b[n]!, a[i]!, b[n]!, b[i]!]
      if (inward) {
        indices.push(tri[0]!, tri[2]!, tri[1]!, tri[3]!, tri[5]!, tri[4]!)
      } else indices.push(...tri)
    }
  }
  const face = (outer: number[], inner: number[][], up: boolean) => {
    const ids = [...outer, ...inner.flat()],
      holesAt: number[] = []
    let offset = outer.length
    for (const hole of inner) {
      holesAt.push(offset)
      offset += hole.length
    }
    const xy = ids.flatMap((i) => [positions[i * 3]!, positions[i * 3 + 1]!])
    const faces = earcut(xy, holesAt, 2)
    for (let i = 0; i < faces.length; i += 3) {
      const a = ids[faces[i]!]!,
        b = ids[faces[i + 1]!]!,
        c = ids[faces[i + 2]!]!
      indices.push(a, up ? b : c, up ? c : b)
    }
  }
  const hasFlange = props.style === "flanged"
  const outsideBottom = ring(0, () =>
    hasFlange ? d.flangeDiameter / 2 : d.bodyDiameter / 2,
  )
  const outsideTop = ring(d.length, () => d.bodyDiameter / 2)
  const holeBottom: number[][] = [],
    holeTop: number[][] = []
  for (const [x, y] of d.mountHoleCenters) {
    const bottom = ring(0, () => d.mountHoleDiameter / 2, holes, x, y),
      top = ring(d.flangeThickness, () => d.mountHoleDiameter / 2, holes, x, y)
    connect(bottom, top, true)
    holeBottom.push(bottom)
    holeTop.push(top)
  }
  if (hasFlange) {
    const shoulderOuter = ring(d.flangeThickness, () => d.flangeDiameter / 2)
    const shoulderInner = ring(d.flangeThickness, () => d.bodyDiameter / 2)
    connect(outsideBottom, shoulderOuter)
    face(shoulderOuter, [shoulderInner, ...holeTop], true)
    connect(shoulderInner, outsideTop)
  } else connect(outsideBottom, outsideTop)
  const levels = new Set(
    Array.from(
      { length: Math.max(2, steps) + 1 },
      (_, i) => (d.length * i) / Math.max(2, steps),
    ),
  )
  levels.add(props.boreChamfer)
  levels.add(d.length - props.boreChamfer)
  const hand = props.threadHand === "right" ? 1 : -1
  let previous: number[] | undefined,
    insideBottom: number[] | undefined,
    insideTop: number[] | undefined
  for (const z of [...levels].sort((a, b) => a - b)) {
    const current = ring(z, (angle) => {
      const phase =
        (((z / d.threadPitch -
          (hand * d.threadStarts * angle) / (2 * Math.PI)) %
          1) +
          1) %
        1
      const u = Math.min(phase, 1 - phase) * d.threadPitch
      const nominal = Math.max(
        d.internalMinorDiameter / 2,
        Math.min(
          d.internalMajorDiameter / 2,
          d.pitchDiameter / 2 +
            (d.threadPitch / 4 - u) / Math.tan(Math.PI / 12),
        ),
      )
      const thread = nominal + props.radialClearance
      const cone = d.mouthDiameter / 2 - Math.min(z, d.length - z)
      return props.boreChamfer ? Math.max(thread, cone) : thread
    })
    if (previous) connect(previous, current, true)
    else insideBottom = current
    previous = current
    insideTop = current
  }
  face(outsideBottom, [insideBottom!, ...holeBottom], false)
  face(outsideTop, [insideTop!], true)
  return { positions, indices }
}
