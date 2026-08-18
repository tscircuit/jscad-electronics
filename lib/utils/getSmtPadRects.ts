import { fp } from "@tscircuit/footprinter"

export interface SmtPadRect {
  x: number
  y: number
  width: number
  height: number
  pin?: string
}

/**
 * A footprint's rectangular SMT pads, for bodies that build a lead per pad.
 *
 * Lead COUNT is not a property of a package outline — SOT-23-5 and SOT-23-6
 * share a body, SC-70-4 and SC-70-6 share a body — so a body picked by outline
 * alone can end up with more or fewer leads than the footprint has pads.
 * Reading the pads makes that impossible.
 *
 * Polygon pads (a SOT-89 tab, say) are skipped: they are not lead feet.
 */
export const getSmtPadRects = (footprint: string): SmtPadRect[] => {
  const elements = fp.string(footprint).circuitJson() as Array<{
    type: string
    shape?: string
    x?: number
    y?: number
    width?: number
    height?: number
    port_hints?: string[]
  }>

  return elements
    .filter(
      (element) =>
        element.type === "pcb_smtpad" &&
        element.shape === "rect" &&
        Number.isFinite(element.x) &&
        Number.isFinite(element.y),
    )
    .map((element) => ({
      x: element.x as number,
      y: element.y as number,
      width: element.width ?? 0.4,
      height: element.height ?? 0.4,
      pin: element.port_hints?.[0],
    }))
}
