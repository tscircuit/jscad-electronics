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
 * X crosses the two lead rows; Y runs along each row. Z=0 is the seating plane.
 * Pin 1 is at negative X, positive Y. Bend curvature and the pin-1 dimple are
 * visual approximations, not additional package-identification parameters.
 */
export interface DualRowGullWingDimensions {
  pinCount: number
  pitch: number
  bodyWidth: number
  bodyLength: number
  /** Overall height A, including standoff A1. */
  bodyHeight: number
  standoff: number
  /** Outer lead-tip to outer lead-tip dimension E. */
  leadSpan: number
  leadWidth: number
  leadThickness: number
  /** Horizontal terminal contact, not the PCB land length. */
  contactLength: number
  /** Per-side inset of the top and bottom mold faces. */
  taperInset: number
  /** Both zero means no exposed pad; otherwise both must be positive. */
  exposedPadWidth?: number
  exposedPadLength?: number
}

export function createDualRowGullWing(p: DualRowGullWingDimensions) {
  const {
    pinCount,
    pitch,
    bodyWidth,
    bodyLength,
    bodyHeight,
    standoff,
    leadSpan,
    leadWidth,
    leadThickness,
    contactLength,
    taperInset,
    exposedPadWidth = 0,
    exposedPadLength = 0,
  } = p
  for (const key of [
    "pitch",
    "bodyWidth",
    "bodyLength",
    "bodyHeight",
    "leadSpan",
    "leadWidth",
    "leadThickness",
    "contactLength",
  ] as const)
    if (!Number.isFinite(p[key]) || p[key] <= 0)
      throw new Error(`${key} must be finite and positive`)
  for (const [name, value] of Object.entries({
    standoff,
    taperInset,
    exposedPadWidth,
    exposedPadLength,
  }))
    if (!Number.isFinite(value) || value < 0)
      throw new Error(`${name} must be finite and nonnegative`)
  if (!Number.isInteger(pinCount) || pinCount < 4 || pinCount % 2)
    throw new Error("pinCount must be even and at least 4")
  const moldHeight = bodyHeight - standoff
  const reach = (leadSpan - bodyWidth) / 2
  const rowLength = (pinCount / 2 - 1) * pitch + leadWidth
  if (
    moldHeight <= leadThickness * 2 ||
    leadWidth >= pitch ||
    rowLength >= bodyLength - 2 * taperInset ||
    taperInset * 2 >= Math.min(bodyWidth, bodyLength) ||
    contactLength >= reach
  )
    throw new Error("Invalid mold, lead spacing, or terminal reach")
  if (
    (exposedPadWidth === 0) !== (exposedPadLength === 0) ||
    exposedPadWidth >= bodyWidth - 2 * taperInset ||
    exposedPadLength >= bodyLength - 2 * taperInset
  )
    throw new Error("Exposed pad must fit inside the bottom mold face")
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
  const lead = (side: number, y: number) => {
    const outer = leadSpan / 2
    const root = bodyWidth / 2 - Math.min(bodyWidth / 8, 0.15)
    const bendStart = outer - contactLength
    const bendEnd = bodyWidth / 2 + Math.min(0.08, (reach - contactLength) / 4)
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
      <Translate offset={{ x: side * x, y, z }}>
        <Cuboid size={[slice, leadWidth, leadThickness]} />
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
            i < pinCount / 2 ? -1 : 1,
            ((pinCount / 2 - 1) / 2 - (i % (pinCount / 2))) * pitch,
          ),
        )}
      </Colorize>
      {exposedPadWidth > 0 && (
        <Colorize color="#bfc1c4">
          <Translate z={(standoff + leadThickness) / 2}>
            <Cuboid
              size={[
                exposedPadWidth,
                exposedPadLength,
                standoff + leadThickness,
              ]}
            />
          </Translate>
        </Colorize>
      )}
    </>
  )
}
