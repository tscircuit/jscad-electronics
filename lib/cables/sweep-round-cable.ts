import { add, scale } from "./path-frames"
import type { CableFrame, CableMesh, CableColor } from "./types"

/** Closed indexed sweep around a supplied centerline; this does not choose a route. */
export function sweepRoundCable({
  frames,
  diameter,
  offset = 0,
  radialSegments,
  color,
  name,
}: {
  frames: CableFrame[]
  diameter: number
  offset?: number
  radialSegments: number
  color: CableColor
  name: string
}): CableMesh {
  const positions: number[] = []
  const indices: number[] = []
  for (const frame of frames) {
    const center = add(frame.point, scale(frame.normal, offset))
    for (let side = 0; side < radialSegments; side++) {
      const angle = (side * Math.PI * 2) / radialSegments
      positions.push(
        ...add(
          center,
          add(
            scale(frame.normal, (diameter * Math.cos(angle)) / 2),
            scale(frame.binormal, (diameter * Math.sin(angle)) / 2),
          ),
        ),
      )
    }
  }
  for (let ring = 0; ring < frames.length - 1; ring++) {
    for (let side = 0; side < radialSegments; side++) {
      const a = ring * radialSegments + side
      const b = ring * radialSegments + ((side + 1) % radialSegments)
      const c = a + radialSegments
      const d = b + radialSegments
      indices.push(a, b, c, b, d, c)
    }
  }
  const startCenter = positions.length / 3
  positions.push(...add(frames[0]!.point, scale(frames[0]!.normal, offset)))
  const endCenter = positions.length / 3
  positions.push(
    ...add(frames.at(-1)!.point, scale(frames.at(-1)!.normal, offset)),
  )
  const lastRing = (frames.length - 1) * radialSegments
  for (let side = 0; side < radialSegments; side++) {
    const next = (side + 1) % radialSegments
    indices.push(
      startCenter,
      next,
      side,
      endCenter,
      lastRing + side,
      lastRing + next,
    )
  }
  return { name, positions, indices, color, smooth: true }
}
