import {
  getNylonLockNutDimensions,
  nylonLockNutModelPropsSchema,
  type NylonLockNutModelPropsInput,
} from "@tscircuit/modelprinter"

export interface NylonLockNutMesh {
  positions: number[]
  indices: number[]
}
export interface NylonLockNutMeshOptions {
  radialSegments?: number
  segmentsPerPitch?: number
}
export interface NylonLockNutMeshes {
  metal: NylonLockNutMesh
  insert: NylonLockNutMesh
}

function surface(segments: number) {
  const positions: number[] = [],
    indices: number[] = []
  let first = -1,
    previous = -1
  const connect = (a: number, b: number) => {
    for (let i = 0; i < segments; i++) {
      const n = (i + 1) % segments
      indices.push(a + i, a + n, b + n, a + i, b + n, b + i)
    }
  }
  const ring = (z: number, radius: number | ((angle: number) => number)) => {
    const start = positions.length / 3
    for (let i = 0; i < segments; i++) {
      const angle = (i * 2 * Math.PI) / segments
      const r = typeof radius === "number" ? radius : radius(angle)
      positions.push(r * Math.cos(angle), r * Math.sin(angle), z)
    }
    if (previous >= 0) connect(previous, start)
    else first = start
    previous = start
  }
  return {
    ring,
    finish: () => {
      connect(previous, first)
      return { positions, indices }
    },
  }
}

function generate(
  input: NylonLockNutModelPropsInput,
  options: NylonLockNutMeshOptions,
  assembly: boolean,
) {
  const p = nylonLockNutModelPropsSchema.parse(input)
  const d = getNylonLockNutDimensions(p)
  const radial = options.radialSegments ?? 96,
    axial = options.segmentsPerPitch ?? 32
  if (
    !Number.isInteger(radial) ||
    radial < 24 ||
    radial > 192 ||
    radial % 12 !== 0 ||
    !Number.isInteger(axial) ||
    axial < 8 ||
    axial > 64
  )
    throw new Error(
      "Mesh resolution requires radial segments divisible by 12 in [24,192] and pitch segments in [8,64]",
    )
  const steps = Math.max(2, Math.ceil((d.bodyHeight / d.threadPitch) * axial))
  if (steps > 24000)
    throw new Error("Mesh resolution limit: too many thread intervals")
  const hexRadius = (angle: number) => {
    const period = Math.PI / 3
    const distance =
      ((((angle - Math.PI / 2 + period / 2) % period) + period) % period) -
      period / 2
    return d.acrossFlats / 2 / Math.cos(distance)
  }
  const outerRadius = (z: number, angle: number) =>
    z <= d.bodyHeight
      ? Math.min(
          hexRadius(angle),
          d.faceDiameter / 2 + Math.min(z, d.bodyHeight - z) * Math.sqrt(3),
        )
      : d.collarDiameter / 2 - Math.max(0, z - (d.height - d.collarTopChamfer))
  const outerLevels = new Set([
    0,
    d.outerChamferDepth,
    d.bodyHeight - d.outerChamferDepth,
    d.bodyHeight,
    d.height - d.collarTopChamfer,
    d.height,
  ])
  for (let i = 0; i < radial; i++) {
    const at =
      (hexRadius((i * 2 * Math.PI) / radial) - d.faceDiameter / 2) /
      Math.sqrt(3)
    if (at > 1e-9 && at < d.outerChamferDepth - 1e-9) {
      outerLevels.add(at)
      outerLevels.add(d.bodyHeight - at)
    }
  }
  const metal = surface(radial)
  for (const z of [...outerLevels]
    .sort((a, b) => a - b)
    .filter((z, i, values) => i === 0 || z - values[i - 1]! > 1e-10))
    metal.ring(z, (angle) => outerRadius(z, angle))
  metal.ring(d.height, d.pocketDiameter / 2)
  if (assembly) {
    metal.ring(d.insertTopZ, d.pocketDiameter / 2)
    metal.ring(d.insertTopZ, d.diameter / 2)
    metal.ring(d.insertTopZ - d.insertBoreChamfer, d.insertBoreDiameter / 2)
    metal.ring(d.insertBottomZ, d.insertBoreDiameter / 2)
  } else metal.ring(d.bodyHeight, d.pocketDiameter / 2)
  const innerLevels = new Set(
    p.showThreads
      ? Array.from({ length: steps + 1 }, (_, i) => (d.bodyHeight * i) / steps)
      : [0, d.bodyHeight],
  )
  innerLevels.add(d.boreChamferDepth)
  innerLevels.add(d.bodyHeight - d.threadExitChamferDepth)
  for (const z of [...innerLevels].sort((a, b) => b - a)) {
    metal.ring(z, (angle) => {
      const phase = (((z / d.threadPitch - angle / (2 * Math.PI)) % 1) + 1) % 1
      const distance = Math.min(phase, 1 - phase)
      const groove = Math.min(
        (d.diameter - d.boreMinorDiameter) / 2,
        Math.max(0, (distance - 1 / 8) * d.threadPitch * Math.sqrt(3)),
      )
      return Math.max(
        d.boreMinorDiameter / 2 + (p.showThreads ? groove : 0),
        d.mouthDiameter / 2 - z,
        d.threadExitDiameter / 2 - (d.bodyHeight - z),
      )
    })
  }
  const insert = surface(radial)
  insert.ring(d.insertBottomZ, d.pocketDiameter / 2)
  insert.ring(d.insertTopZ, d.pocketDiameter / 2)
  insert.ring(d.insertTopZ, d.diameter / 2)
  insert.ring(d.insertTopZ - d.insertBoreChamfer, d.insertBoreDiameter / 2)
  insert.ring(d.insertBottomZ, d.insertBoreDiameter / 2)
  return { metal: metal.finish(), insert: insert.finish() }
}

/** Two closed material shells with exact touching pocket interfaces; no volume overlap. */
export function createNylonLockNutMeshes(
  input: NylonLockNutModelPropsInput,
  options: NylonLockNutMeshOptions = {},
): NylonLockNutMeshes {
  return generate(input, options, false)
}
/** Closed assembly exterior without buried metal/nylon contact surfaces. */
export function createNylonLockNutMesh(
  input: NylonLockNutModelPropsInput,
  options: NylonLockNutMeshOptions = {},
): NylonLockNutMesh {
  return generate(input, options, true).metal
}
