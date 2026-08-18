import { fp } from "@tscircuit/footprinter"

export interface PlatedHoleCenter {
  x: number
  y: number
  pin?: string
}

/**
 * Where a footprint's plated holes are, for through-hole bodies that have to
 * put their leads through them.
 *
 * `fp.string(name).json()` does not describe the hole PATTERN, only its
 * parameters, and the pattern is what a lead has to match: `to92` puts its
 * middle pin 1.27mm behind the outer two, `to92s` puts all three in a row and
 * `to92l` offsets the whole group so pin 1 sits at the origin. A body that
 * assumes any one of those is visibly wrong on the other two — leads beside
 * the holes rather than through them.
 */
export const getPlatedHoleCenters = (footprint: string): PlatedHoleCenter[] => {
  const elements = fp.string(footprint).circuitJson() as Array<{
    type: string
    x?: number
    y?: number
    port_hints?: string[]
  }>

  return elements
    .filter(
      (element) =>
        element.type === "pcb_plated_hole" &&
        Number.isFinite(element.x) &&
        Number.isFinite(element.y),
    )
    .map((element) => ({
      x: element.x as number,
      y: element.y as number,
      pin: element.port_hints?.[0],
    }))
}
