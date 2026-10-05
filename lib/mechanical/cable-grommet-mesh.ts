import {
  cableGrommetModelPropsSchema,
  getCableGrommetDimensions,
  type CableGrommetModelPropsInput,
} from "@tscircuit/modelprinter"

export interface CableGrommetMesh {
  positions: number[]
  indices: number[]
}

export interface CableGrommetMeshOptions {
  /** Requested minimum; thin root walls can require more circular segments. */
  radialSegments?: number
}

/** Square-shouldered annulus centered on Z=0, with an open axial cable bore. */
export function createCableGrommetMesh(
  input: CableGrommetModelPropsInput,
  options: CableGrommetMeshOptions = {},
): CableGrommetMesh {
  const props = cableGrommetModelPropsSchema.parse(input)
  const dimensions = getCableGrommetDimensions(props)
  const inner = props.innerDiameter / 2
  const root = dimensions.grooveRootDiameter / 2
  const outer = props.outerDiameter / 2
  const requested = options.radialSegments ?? 96
  if (
    !Number.isInteger(requested) ||
    requested < 12 ||
    requested > 4096 ||
    requested % 4 !== 0
  )
    throw new Error(
      "Grommet radial segments must be a multiple of four in [12,4096]",
    )
  // Keep exterior chord interiors beyond the nominal bore, even for thin walls.
  const wallAngle = Math.acos((inner + root) / (2 * root))
  const segments = Math.max(requested, 4 * Math.ceil(Math.PI / wallAngle / 4))
  if (!Number.isFinite(segments) || segments > 4096)
    throw new Error(
      "Grommet wall exceeds mesh resolution limit (4096 segments)",
    )

  const section: [number, number][] = [
    [inner, -props.height / 2],
    [outer, -props.height / 2],
    [outer, dimensions.grooveStartZ],
    [root, dimensions.grooveStartZ],
    [root, dimensions.grooveEndZ],
    [outer, dimensions.grooveEndZ],
    [outer, props.height / 2],
    [inner, props.height / 2],
  ]
  const positions: number[] = []
  const indices: number[] = []
  for (const [radius, z] of section)
    for (let sample = 0; sample < segments; sample++) {
      const angle = (sample * 2 * Math.PI) / segments
      positions.push(radius * Math.cos(angle), radius * Math.sin(angle), z)
    }
  for (let ring = 0; ring < section.length; ring++) {
    const a = ring * segments
    const b = ((ring + 1) % section.length) * segments
    for (let sample = 0; sample < segments; sample++) {
      const next = (sample + 1) % segments
      indices.push(
        a + sample,
        a + next,
        b + next,
        a + sample,
        b + next,
        b + sample,
      )
    }
  }
  return { positions, indices }
}
