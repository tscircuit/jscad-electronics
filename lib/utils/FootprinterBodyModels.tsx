import { LGA } from "../LGA"
import { SSOP } from "../SSOP"

export interface BodyFootprintParameters {
  fn: string
  num_pins: number
  w: number
  h: number
  p: number
  pw: number
  pl: number
  grid?: { x: number; y: number }
  bodywidth?: number
  bodyheight?: number
  bodythickness?: number
}

/** Consume only fields validated by Footprinter. Body height is Y in its
 * schema; body thickness is Z. Terminal dimensions are still approximations
 * until physical terminal fields are added upstream. No part lookup is used.
 */
export function renderFootprinterBodyModel(p: BodyFootprintParameters) {
  if (
    p.bodywidth === undefined &&
    p.bodyheight === undefined &&
    p.bodythickness === undefined
  )
    return null
  if (p.fn === "ssop") {
    const bodyWidth = p.bodywidth ?? p.w * 0.55
    const bodyLength = p.bodyheight ?? (p.num_pins / 2 - 1) * p.p + p.pw + 0.4
    const thickness = p.bodythickness ?? 1
    const leadWidth = Math.min(p.pw, p.p * 0.5)
    const rowLength = (p.num_pins / 2 - 1) * p.p + leadWidth
    if (bodyLength <= rowLength)
      throw new Error("SSOP bodyheight must contain the lead row")
    // Footprinter's SSOP row centers are w + 0.2 apart. Estimate the lead
    // tip within each copper land; this is not a physical lead-span token.
    const leadSpan = Math.max(p.w + 0.2 + p.pl / 2, bodyWidth + p.p)
    const standoff = Math.min(0.1, thickness / 10)
    return (
      <SSOP
        pinCount={p.num_pins}
        pitch={p.p}
        bodyWidth={bodyWidth}
        bodyLength={bodyLength}
        bodyHeight={thickness + standoff}
        standoff={standoff}
        leadSpan={leadSpan}
        leadWidth={leadWidth}
        leadThickness={Math.min(0.15, thickness / 4)}
        contactLength={Math.min(p.pl / 2, (leadSpan - bodyWidth) / 4)}
        taperInset={Math.min(0.12, (bodyLength - rowLength) / 4, bodyWidth / 8)}
      />
    )
  }
  if (p.fn === "lga") {
    const bodyWidth = p.bodywidth ?? p.w
    const bodyLength = p.bodyheight ?? p.h
    const thickness = p.bodythickness ?? 1
    const grid = p.grid!
    const landWidth = Math.min(p.pw, p.p / 2)
    const roomX = bodyWidth - ((grid.y - 1) * p.p + landWidth)
    const roomY = bodyLength - ((grid.x - 1) * p.p + landWidth)
    const landLength = Math.min(
      p.pl / 2,
      bodyWidth / 8,
      bodyLength / 8,
      roomX / 4,
      roomY / 4,
    )
    // Use short edge lands; copper land lengths do not measure metallization.
    // Keep them within the specified mold rather than treating copper as body.
    return (
      <LGA
        bodyWidth={bodyWidth}
        bodyLength={bodyLength}
        bodyHeight={thickness}
        landsPerSideX={grid.x}
        landsPerSideY={grid.y}
        pitch={p.p}
        landWidth={landWidth}
        landLength={landLength}
        edgeInset={0}
        landThickness={Math.min(0.015, thickness / 10)}
      />
    )
  }
  return null
}
