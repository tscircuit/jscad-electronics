import { getSmtPadRects } from "./getSmtPadRects"

/**
 * Measure the rigid rotation Footprinter applies for `pin1location(...)`.
 *
 * `fp.string(...).json()` returns canonical package parameters, while the
 * final Circuit JSON contains the requested pin-1 transform. Matching two
 * numbered pads between those representations recovers the transform without
 * duplicating Footprinter's location rules here.
 */
export const getPin1LocationRotation = (
  footprint: string,
  signalPinCount: number,
): number => {
  const canonicalFootprint = footprint.replace(/_pin1location\([^)]*\)/g, "")
  if (canonicalFootprint === footprint) return 0

  const signalPads = (value: string) =>
    getSmtPadRects(value, { includeRotated: true }).filter((pad) => {
      const pin = Number(pad.pin)
      return Number.isInteger(pin) && pin >= 1 && pin <= signalPinCount
    })
  const canonicalPads = signalPads(canonicalFootprint)
  const targetPads = signalPads(footprint)
  const matchingPads = targetPads
    .map((target) => ({
      target,
      canonical: canonicalPads.find((pad) => pad.pin === target.pin),
    }))
    .filter(
      (
        pair,
      ): pair is {
        target: (typeof targetPads)[number]
        canonical: (typeof canonicalPads)[number]
      } => pair.canonical !== undefined,
    )
  if (matchingPads.length < 2) return 0

  const [a, b] = matchingPads
  const canonicalAngle = Math.atan2(
    b!.canonical.y - a!.canonical.y,
    b!.canonical.x - a!.canonical.x,
  )
  const targetAngle = Math.atan2(
    b!.target.y - a!.target.y,
    b!.target.x - a!.target.x,
  )
  return (
    Math.round((targetAngle - canonicalAngle) / (Math.PI / 2)) * (Math.PI / 2)
  )
}
