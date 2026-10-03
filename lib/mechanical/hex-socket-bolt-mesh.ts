import {
  hexSocketBoltDimensions,
  hexSocketBoltModelPropsSchema,
  type HexSocketBoltModelPropsInput,
} from "@tscircuit/modelprinter"

/** Indexed triangles, counterclockwise from outside; millimeters, Z up. */
export interface HexSocketBoltMesh {
  positions: number[]
  indices: number[]
}

/**
 * Head bearing plane at Z=0; tip at -length; head extends along +Z.
 * Produces a closed surface with a blind hex socket and a right-hand,
 * truncated 60-degree helical thread. Threads are a visual approximation.
 * No renderer dependencies are needed to consume the indexed mesh.
 */
export const createHexSocketBoltMesh = (
  input: HexSocketBoltModelPropsInput,
): HexSocketBoltMesh => {
  const props = hexSocketBoltModelPropsSchema.parse(input)
  const {
    diameter,
    threadPitch: pitch,
    headDiameter,
    headHeight,
    socketWidth,
    socketDepth,
  } = hexSocketBoltDimensions[props.metricSize]
  const { length, showThreads } = props
  const segments = 96 // Divisible by six, so socket corners are exact.
  const steps = showThreads ? Math.max(2, Math.ceil((length / pitch) * 24)) : 2
  // Avoid unbounded allocations for user-supplied lengths.
  if (steps > 24000)
    throw new Error(
      "Bolt length exceeds mesh resolution limit (1000 thread turns)",
    )
  const positions: number[] = []
  const indices: number[] = []
  const radius = diameter / 2
  const depth = pitch * 0.61343
  const bevel = Math.min(0.2, headHeight * 0.08)
  const tipBevel = Math.min(pitch * 0.6, length / 3)

  const ring = (z: number, radiusAt: (angle: number) => number) => {
    const start = positions.length / 3
    for (let i = 0; i < segments; i++) {
      const angle = (i * Math.PI * 2) / segments
      const r = radiusAt(angle)
      positions.push(r * Math.cos(angle), r * Math.sin(angle), z)
    }
    return start
  }
  // Following the surface from tip to socket floor also sets the winding for
  // the shoulder, top annulus and inward-facing socket walls correctly.
  const connect = (a: number, b: number) => {
    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments
      indices.push(a + i, a + next, b + next, a + i, b + next, b + i)
    }
  }
  const cap = (start: number, z: number, upward: boolean) => {
    const center = positions.length / 3
    positions.push(0, 0, z)
    for (let i = 0; i < segments; i++) {
      const a = start + i
      const b = start + ((i + 1) % segments)
      indices.push(center, upward ? a : b, upward ? b : a)
    }
  }
  let previous = -1
  // A smooth shank needs only its tip, bevel end and bearing plane. Sampling
  // it at thread pitch adds thousands of coplanar faces and makes STEP export
  // quadratic without improving the shape.
  const shaftLevels = showThreads
    ? Array.from(
        { length: steps + 1 },
        (_, step) => -length + (length * step) / steps,
      )
    : [-length, -length + tipBevel, 0]
  for (const z of shaftLevels) {
    const current = ring(z, (angle) => {
      // Constant phase winds counterclockwise as Z increases (right-hand).
      const phase = (((z / pitch - angle / (2 * Math.PI)) % 1) + 1) % 1
      const distance = Math.min(phase, 1 - phase)
      const groove = Math.min(
        depth,
        Math.max(0, (distance - 1 / 16) * pitch * Math.sqrt(3)),
      )
      const endRamp = Math.min(
        1,
        (z + length) / tipBevel,
        -z / Math.min(pitch / 2, length / 3),
      )
      const tipCut = tipBevel * Math.max(0, 1 - (z + length) / tipBevel)
      return radius - (showThreads ? groove * endRamp : 0) - tipCut
    })
    if (previous < 0) cap(current, z, false)
    else connect(previous, current)
    previous = current
  }
  const addRing = (z: number, radiusAt: (angle: number) => number) => {
    const current = ring(z, radiusAt)
    connect(previous, current)
    previous = current
  }
  addRing(0, () => headDiameter / 2 - bevel)
  addRing(bevel, () => headDiameter / 2)
  addRing(headHeight - bevel, () => headDiameter / 2)
  addRing(headHeight, () => headDiameter / 2 - bevel)
  const hexRadius = (angle: number, acrossFlats: number) =>
    acrossFlats /
    2 /
    Math.cos(((angle + Math.PI / 6) % (Math.PI / 3)) - Math.PI / 6)
  addRing(headHeight, (angle) => hexRadius(angle, socketWidth + bevel))
  addRing(headHeight - bevel / 2, (angle) => hexRadius(angle, socketWidth))
  addRing(headHeight - socketDepth, (angle) => hexRadius(angle, socketWidth))
  cap(previous, headHeight - socketDepth, true)
  return { positions, indices }
}
