import { Colorize, Cuboid, Translate, Cylinder, Subtract } from "jscad-fiber"
/** Molded perimeter-land LGA. Opposite rows have equal counts; adjacent rows
 * may differ. Pads remain entirely under the body, with no QFN exposed pad.
 * X crosses the left/right rows. Pin 1 is at -X,+Y; dimensions are in mm.
 * This models the external envelope, not sensor-specific lids or apertures.
 */
export interface LGAProps {
  bodyWidth: number
  bodyLength: number
  bodyHeight: number
  landsPerSideX: number
  landsPerSideY: number
  pitch: number
  landWidth: number
  landLength: number
  /** Distance from the body edge to the outer edge of each land. */
  edgeInset: number
  /** Representative metallization thickness, not solder standoff. */
  landThickness: number
}
export function LGA(p: LGAProps) {
  for (const k of [
    "bodyWidth",
    "bodyLength",
    "bodyHeight",
    "pitch",
    "landWidth",
    "landLength",
    "landThickness",
  ] as const)
    if (!Number.isFinite(p[k]) || p[k] <= 0)
      throw new Error(`${k} must be finite and positive`)
  for (const k of ["landsPerSideX", "landsPerSideY"] as const)
    if (!Number.isInteger(p[k]) || p[k] < 0)
      throw new Error(`${k} must be a nonnegative integer`)
  if (
    !Number.isFinite(p.edgeInset) ||
    p.edgeInset < 0 ||
    p.landThickness >= p.bodyHeight ||
    p.landWidth >= p.pitch ||
    p.landsPerSideX + p.landsPerSideY < 1
  )
    throw new Error("Invalid land layout or thickness")
  const layouts = [
    {
      count: p.landsPerSideX,
      across: p.bodyWidth,
      along: p.bodyLength,
      horizontal: true,
    },
    {
      count: p.landsPerSideY,
      across: p.bodyLength,
      along: p.bodyWidth,
      horizontal: false,
    },
  ]
  for (const l of layouts) {
    if (l.count === 0) continue
    const row = (l.count - 1) * p.pitch + p.landWidth
    if (
      row >= l.along - 2 * p.edgeInset ||
      2 * (p.edgeInset + p.landLength) >= l.across
    )
      throw new Error(
        "Lands must fit below the body without opposite-row overlap",
      )
    const other = l.horizontal ? p.landsPerSideY : p.landsPerSideX
    if (
      other > 0 &&
      row >= l.along - 2 * (p.edgeInset + p.landLength) &&
      (other - 1) * p.pitch + p.landWidth >=
        l.across - 2 * (p.edgeInset + p.landLength)
    )
      throw new Error("Adjacent land rows overlap at corners")
  }
  const r = Math.min(p.bodyWidth, p.bodyLength) * 0.035
  return (
    <>
      <Colorize color="#353535">
        <Subtract>
          <Translate z={(p.bodyHeight + p.landThickness / 2) / 2}>
            <Cuboid
              size={[
                p.bodyWidth,
                p.bodyLength,
                p.bodyHeight - p.landThickness / 2,
              ]}
            />
          </Translate>
          <Translate
            offset={[
              -p.bodyWidth / 2 + 2 * r,
              p.bodyLength / 2 - 2 * r,
              p.bodyHeight,
            ]}
          >
            <Cylinder radius={r} height={Math.min(0.04, p.bodyHeight / 10)} />
          </Translate>
        </Subtract>
      </Colorize>
      <Colorize color="#c5b987">
        {layouts.flatMap((l) =>
          [-1, 1].flatMap((sign) =>
            Array.from({ length: l.count }, (_, i) => {
              const across =
                  sign * (l.across / 2 - p.edgeInset - p.landLength / 2),
                along = ((l.count - 1) / 2 - i) * p.pitch
              return (
                <Translate
                  key={`${l.horizontal}-${sign}-${i}`}
                  offset={[
                    l.horizontal ? across : along,
                    l.horizontal ? along : across,
                    p.landThickness / 2,
                  ]}
                >
                  <Cuboid
                    size={
                      l.horizontal
                        ? [p.landLength, p.landWidth, p.landThickness]
                        : [p.landWidth, p.landLength, p.landThickness]
                    }
                  />
                </Translate>
              )
            }),
          ),
        )}
      </Colorize>
    </>
  )
}
