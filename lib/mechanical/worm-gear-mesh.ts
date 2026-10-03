import {
  getWormGearDimensions,
  wormGearModelPropsSchema,
  type WormGearModelPropsInput,
} from "@tscircuit/modelprinter"
import earcut from "earcut"

/** Indexed triangles, counterclockwise from outside; millimeters, Z up. */
export interface WormGearMesh {
  positions: number[]
  indices: number[]
}

/**
 * A cylindrical worm from Z=0 to Z=length, with square-cut ends.
 * The axial trapezoidal rack profile is swept around +Z. A right-hand crest
 * winds counterclockwise as Z increases; phase rotates the entire solid.
 * This is a faceted visual worm, not a hobbed wheel or a conjugate gear pair.
 */
export const createWormGearMesh = (
  input: WormGearModelPropsInput,
): WormGearMesh => {
  const props = wormGearModelPropsSchema.parse(input)
  const { outsideDiameter, rootDiameter, axialPitch, lead, toothThickness } =
    getWormGearDimensions(props)
  const outsideRadius = outsideDiameter / 2
  const rootRadius = rootDiameter / 2
  const pitchRadius = props.pitchDiameter / 2
  const pressureTangent = Math.tan((props.pressureAngle * Math.PI) / 180)
  const tipHalfWidth = toothThickness / 2 - props.module * pressureTangent
  const rootHalfWidth =
    toothThickness / 2 + (props.module + props.clearance) * pressureTangent

  // Each pitch has exact crest, pitch-cylinder and root samples.
  // Rotating this same profile at every level preserves narrow crests and
  // troughs even for multiple starts, instead of aliasing a fixed angle grid.
  // Root facets must stay outside a stationary bore, including between Z
  // levels. A triangle's angular span is at most its ring gap plus helix twist,
  // so bound both by acos(bore/root), with margin for numerical roundoff.
  const boreRadius = props.boreDiameter / 2
  const angularStepLimit =
    boreRadius > 0 ? Math.acos(boreRadius / rootRadius) * 0.8 : Infinity
  const samplesPerPitch = Math.max(
    Math.ceil(props.radialSegments / props.starts),
    Math.ceil((Math.PI * 2) / (props.starts * angularStepLimit)),
  )
  // segmentsPerTurn controls a revolution of the helix (one lead). Also keep
  // at least twelve axial levels per pitch when several starts share a lead.
  const stepsPerTurn = Math.max(
    props.segmentsPerTurn,
    props.radialSegments,
    props.starts * 12,
    Math.ceil((Math.PI * 2) / angularStepLimit),
  )
  const steps = Math.max(1, Math.ceil((props.length / lead) * stepsPerTurn))
  const extraVertices = boreRadius > 0 ? props.radialSegments * 2 : 2
  // Check before allocating any user-sized array, including dense angular
  // samples required by an almost-root-diameter bore.
  if (
    !Number.isFinite(samplesPerPitch) ||
    !Number.isFinite(steps) ||
    (steps + 1) * (samplesPerPitch + 6) * props.starts + extraVertices >
      1_000_000
  ) {
    throw new Error(
      "Worm gear exceeds mesh resolution limit (1000000 vertices); reduce length or resolution, or increase module or bore wall thickness",
    )
  }
  const corners = [
    0,
    tipHalfWidth / axialPitch,
    toothThickness / (2 * axialPitch),
    rootHalfWidth / axialPitch,
    1 - rootHalfWidth / axialPitch,
    1 - toothThickness / (2 * axialPitch),
    1 - tipHalfWidth / axialPitch,
    1,
  ]
  const fractions: number[] = []
  for (let index = 0; index < corners.length - 1; index++) {
    const from = corners[index]!
    const width = corners[index + 1]! - from
    const subdivisions = Math.max(1, Math.ceil(width * samplesPerPitch))
    for (let subdivision = 0; subdivision < subdivisions; subdivision++) {
      const fraction = from + (width * subdivision) / subdivisions
      if (
        fractions.length === 0 ||
        fraction - fractions[fractions.length - 1]! > 1e-12
      )
        fractions.push(fraction)
    }
  }
  const profile: { angle: number; radius: number }[] = []
  for (let start = 0; start < props.starts; start++) {
    for (const fraction of fractions) {
      const distance = Math.min(fraction, 1 - fraction) * axialPitch
      profile.push({
        angle: ((start + fraction) * Math.PI * 2) / props.starts,
        radius:
          distance <= tipHalfWidth
            ? outsideRadius
            : distance >= rootHalfWidth
              ? rootRadius
              : pitchRadius + (toothThickness / 2 - distance) / pressureTangent,
      })
    }
  }

  const count = profile.length

  const positions: number[] = []
  const indices: number[] = []
  const phase = ((props.phase % 360) * Math.PI) / 180
  const direction = props.handedness === "right" ? 1 : -1
  const ring = (z: number) => {
    const first = positions.length / 3
    const rotation = phase + direction * (z / lead) * Math.PI * 2
    for (const sample of profile) {
      const angle = sample.angle + rotation
      positions.push(
        sample.radius * Math.cos(angle),
        sample.radius * Math.sin(angle),
        z,
      )
    }
    return first
  }
  const connect = (lower: number, upper: number) => {
    for (let index = 0; index < count; index++) {
      const next = (index + 1) % count
      indices.push(
        lower + index,
        lower + next,
        upper + next,
        lower + index,
        upper + next,
        upper + index,
      )
    }
  }
  const bottom = ring(0)
  let previous = bottom
  for (let step = 1; step <= steps; step++) {
    const current = ring(props.length * (step / steps))
    connect(previous, current)
    previous = current
  }
  const top = previous

  if (props.boreDiameter === 0) {
    const cap = (boundary: number, z: number, upward: boolean) => {
      const center = positions.length / 3
      positions.push(0, 0, z)
      for (let index = 0; index < count; index++) {
        const next = (index + 1) % count
        indices.push(
          center,
          boundary + (upward ? index : next),
          boundary + (upward ? next : index),
        )
      }
    }
    cap(bottom, 0, false)
    cap(top, props.length, true)
  } else {
    // The bore has stationary circular rings. Keeping it independent of the
    // rotating tooth rings avoids twisting or narrowing the cylindrical bore.
    const holeCount = props.radialSegments
    const boreRing = (z: number) => {
      const first = positions.length / 3
      for (let index = 0; index < holeCount; index++) {
        const angle = phase + (index * Math.PI * 2) / holeCount
        positions.push(
          boreRadius * Math.cos(angle),
          boreRadius * Math.sin(angle),
          z,
        )
      }
      return first
    }
    const holeBottom = boreRing(0)
    const holeTop = boreRing(props.length)
    for (let index = 0; index < holeCount; index++) {
      const next = (index + 1) % holeCount
      indices.push(
        holeBottom + index,
        holeTop + next,
        holeBottom + next,
        holeBottom + index,
        holeTop + index,
        holeTop + next,
      )
    }
    const cap = (boundary: number, hole: number, upward: boolean) => {
      const vertices = Array.from(
        { length: count },
        (_, index) => boundary + index,
      )
      vertices.push(
        ...Array.from({ length: holeCount }, (_, index) => hole + index),
      )
      const flat = vertices.flatMap((vertex) => [
        positions[vertex * 3]!,
        positions[vertex * 3 + 1]!,
      ])
      const triangles = earcut(flat, [count], 2)
      for (let index = 0; index < triangles.length; index += 3) {
        const a = vertices[triangles[index]!]!
        const b = vertices[triangles[index + 1]!]!
        const c = vertices[triangles[index + 2]!]!
        const signedArea =
          (positions[b * 3]! - positions[a * 3]!) *
            (positions[c * 3 + 1]! - positions[a * 3 + 1]!) -
          (positions[b * 3 + 1]! - positions[a * 3 + 1]!) *
            (positions[c * 3]! - positions[a * 3]!)
        indices.push(
          a,
          signedArea > 0 === upward ? b : c,
          signedArea > 0 === upward ? c : b,
        )
      }
    }
    cap(bottom, holeBottom, false)
    cap(top, holeTop, true)
  }

  return { positions, indices }
}
