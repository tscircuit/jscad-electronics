import {
  Colorize,
  Cuboid,
  Cylinder,
  Hull,
  Subtract,
  Translate,
  Union,
} from "jscad-fiber"

/** Physical package dimensions in mm, independent of copper land dimensions.
 * Four equal lead rows surround the mold. Z=0 is the seating plane.
 * Pin 1 is at negative X, positive Y. Bend curvature and the pin-1 dimple are
 * visual approximations, not additional package-identification parameters.
 */
export interface PhysicalLqfpDimensions {
  pinCount: number
  pitch: number
  bodyWidth: number
  bodyLength: number
  /** Overall height A, including standoff A1. */
  bodyHeight: number
  standoff: number
  /** Outer lead-tip to outer lead-tip dimension E. */
  leadSpanX: number
  leadSpanY: number
  leadWidth: number
  leadThickness: number
  /** Horizontal terminal contact, not the PCB land length. */
  contactLength: number
  /** Per-side inset of the top and bottom mold faces. */
  taperInset: number
}

export function createPhysicalLqfp(p: PhysicalLqfpDimensions) {
  const {
    pinCount,
    pitch,
    bodyWidth,
    bodyLength,
    bodyHeight,
    standoff,
    leadSpanX,
    leadSpanY,
    leadWidth,
    leadThickness,
    contactLength,
    taperInset,
  } = p
  for (const key of [
    "pitch",
    "bodyWidth",
    "bodyLength",
    "bodyHeight",
    "leadSpanX",
    "leadSpanY",
    "leadWidth",
    "leadThickness",
    "contactLength",
  ] as const)
    if (!Number.isFinite(p[key]) || p[key] <= 0)
      throw new Error(`${key} must be finite and positive`)
  for (const [name, value] of Object.entries({
    standoff,
    taperInset,
  }))
    if (!Number.isFinite(value) || value < 0)
      throw new Error(`${name} must be finite and nonnegative`)
  if (!Number.isInteger(pinCount) || pinCount < 8 || pinCount % 4)
    throw new Error("pinCount must be divisible by four and at least eight")
  const moldHeight = bodyHeight - standoff
  const reach = Math.min(leadSpanX - bodyWidth, leadSpanY - bodyLength) / 2
  const rowLength = (pinCount / 4 - 1) * pitch + leadWidth
  if (
    moldHeight <= leadThickness * 2 ||
    leadWidth >= pitch ||
    rowLength >= Math.min(bodyWidth, bodyLength) - 2 * taperInset ||
    taperInset * 2 >= Math.min(bodyWidth, bodyLength) ||
    contactLength >= reach
  )
    throw new Error("Invalid mold, lead spacing, or terminal reach")
  const midZ = standoff + moldHeight / 2
  const slice = Math.min(0.002, moldHeight / 100)
  const body = (
    <Hull>
      <Translate z={standoff + slice / 2}>
        <Cuboid
          size={[
            bodyWidth - 2 * taperInset,
            bodyLength - 2 * taperInset,
            slice,
          ]}
        />
      </Translate>
      <Translate z={midZ}>
        <Cuboid size={[bodyWidth, bodyLength, slice]} />
      </Translate>
      <Translate z={bodyHeight - slice / 2}>
        <Cuboid
          size={[
            bodyWidth - 2 * taperInset,
            bodyLength - 2 * taperInset,
            slice,
          ]}
        />
      </Translate>
    </Hull>
  )
  const dimpleRadius = Math.min(bodyWidth, bodyLength) * 0.045
  const dimpleDepth = Math.min(0.04, moldHeight / 10)
  // Smoothstep centerline, made from overlapping convex slices: positive-volume
  // solids in both React and vanilla renderers. Each root extends into the mold.
  const lead = (side: number, along: number) => {
    const horizontal = side % 2 === 0
    const sign = side < 2 ? -1 : 1
    const width = horizontal ? bodyWidth : bodyLength
    const outer = (horizontal ? leadSpanX : leadSpanY) / 2
    const root = width / 2 - Math.min(width / 8, 0.15)
    const bendStart = outer - contactLength
    const bendEnd = width / 2 + Math.min(0.08, (reach - contactLength) / 4)
    const points: [number, number][] = [
      [outer - slice / 2, leadThickness / 2],
      [bendStart, leadThickness / 2],
    ]
    for (let i = 1; i <= 12; i++) {
      const t = i / 12
      points.push([
        bendStart + (bendEnd - bendStart) * t,
        leadThickness / 2 + (midZ - leadThickness / 2) * t * t * (3 - 2 * t),
      ])
    }
    points.push([root, midZ])
    const section = ([x, z]: [number, number]) => (
      <Translate
        offset={{
          x: horizontal ? sign * x : along,
          y: horizontal ? along : sign * x,
          z,
        }}
      >
        <Cuboid
          size={
            horizontal
              ? [slice, leadWidth, leadThickness]
              : [leadWidth, slice, leadThickness]
          }
        />
      </Translate>
    )
    return (
      <Union>
        {points.slice(1).map((point, i) => (
          <Hull key={i}>
            {section(points[i]!)}
            {section(point)}
          </Hull>
        ))}
      </Union>
    )
  }
  return (
    <>
      <Colorize color="#353535">
        <Subtract>
          {body}
          <Translate
            offset={{
              x: -bodyWidth / 2 + taperInset + dimpleRadius * 2,
              y: bodyLength / 2 - taperInset - dimpleRadius * 2,
              z: bodyHeight,
            }}
          >
            <Cylinder radius={dimpleRadius} height={dimpleDepth * 2} />
          </Translate>
        </Subtract>
      </Colorize>
      <Colorize color="#bfc1c4">
        {Array.from({ length: pinCount }, (_, i) =>
          lead(
            Math.floor(i / (pinCount / 4)),
            ((pinCount / 4 - 1) / 2 - (i % (pinCount / 4))) * pitch,
          ),
        )}
      </Colorize>
    </>
  )
}
