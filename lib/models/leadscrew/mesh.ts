import {
  leadScrewModelPropsSchema,
  getLeadScrewDimensions,
  type LeadScrewModelPropsInput,
} from "@tscircuit/modelprinter"
export interface LeadScrewMesh {
  positions: number[]
  indices: number[]
}
export interface LeadScrewMeshOptions {
  radialSegments?: number
  segmentsPerPitch?: number
}
function resolution(options: LeadScrewMeshOptions) {
  const radial = options.radialSegments ?? 96,
    axial = options.segmentsPerPitch ?? 16
  if (
    !Number.isInteger(radial) ||
    radial < 32 ||
    radial > 192 ||
    radial % 16 !== 0 ||
    !Number.isInteger(axial) ||
    axial < 8 ||
    axial > 64
  )
    throw new Error(
      "Mesh resolution limit: radial segments must be a multiple of 16 in [32,192], pitch segments an integer in [8,64]",
    )
  return { radial, axial }
}
/** Sampled 30 degree trapezoidal profile; crest phase at +X, Z=0, all starts included. */
export function createLeadScrewMesh(
  input: LeadScrewModelPropsInput,
  options: LeadScrewMeshOptions = {},
): LeadScrewMesh {
  const props = leadScrewModelPropsSchema.parse(input),
    d = getLeadScrewDimensions(input)
  const { radial, axial } = resolution(options)
  const steps = Math.ceil((d.length / d.threadPitch) * axial)
  if (
    !Number.isFinite(steps) ||
    steps > 12000 ||
    (steps + 3) * radial > 1200000 ||
    d.endDiameter < 1e-6
  )
    throw new Error(
      "Mesh resolution limit: excessive length/pitch or vanishing end radius",
    )
  const positions: number[] = [],
    indices: number[] = []
  const levels = new Set(
    Array.from(
      { length: Math.max(2, steps) + 1 },
      (_, i) => (d.length * i) / Math.max(2, steps),
    ),
  )
  levels.add(props.chamfer)
  levels.add(d.length - props.chamfer)
  const hand = props.threadHand === "right" ? 1 : -1
  for (const z of [...levels].sort((a, b) => a - b)) {
    const current = positions.length / 3
    for (let i = 0; i < radial; i++) {
      const angle = (i * 2 * Math.PI) / radial
      const phase =
        (((z / d.threadPitch -
          (hand * d.threadStarts * angle) / (2 * Math.PI)) %
          1) +
          1) %
        1
      const u = Math.min(phase, 1 - phase) * d.threadPitch
      const thread = Math.max(
        d.externalMinorDiameter / 2,
        Math.min(
          d.diameter / 2,
          d.pitchDiameter / 2 +
            (d.threadPitch / 4 - u) / Math.tan(Math.PI / 12),
        ),
      )
      const envelope =
        d.diameter / 2 - Math.max(0, props.chamfer - Math.min(z, d.length - z))
      const r = Math.min(thread, envelope)
      positions.push(r * Math.cos(angle), r * Math.sin(angle), z)
    }
    if (current)
      for (let i = 0; i < radial; i++) {
        const n = (i + 1) % radial,
          prev = current - radial
        indices.push(
          prev + i,
          prev + n,
          current + n,
          prev + i,
          current + n,
          current + i,
        )
      }
  }
  for (const [start, z, up] of [
    [0, 0, false],
    [positions.length / 3 - radial, d.length, true],
  ] as const) {
    const center = positions.length / 3
    positions.push(0, 0, z)
    for (let i = 0; i < radial; i++) {
      const n = (i + 1) % radial
      indices.push(center, start + (up ? i : n), start + (up ? n : i))
    }
  }
  return { positions, indices }
}
