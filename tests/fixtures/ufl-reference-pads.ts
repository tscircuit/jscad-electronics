import * as jscad from "@jscad/modeling"

export type UflReferencePad = {
  pin: number
  x: number
  y: number
  width: number
  height: number
}

// Hirose U.FL series catalog, receptacle drawing and recommended land pattern:
// https://www.hirose.com/en/product/document?documentid=ed_U.FL_CAT&documenttype=Catalog&lang=en&series=U.FL
// Coordinates use the copper bounding-box center, not the coaxial axis.
// Keep this reference independent of both the renderer and Footprinter so a
// shifted body or an incorrectly normalized model cannot shift its test pads.
export const uflReferencePads: UflReferencePad[] = [
  { pin: 1, x: 0.45, y: 1.5, width: 2.2, height: 1.1 },
  { pin: 2, x: -0.8, y: 0, width: 1.5, height: 1.1 },
  { pin: 3, x: 0.45, y: -1.5, width: 2.2, height: 1.1 },
]

export const uflReferenceCases = [
  { source: "ufl", pads: uflReferencePads },
  { source: "ufl3", pads: uflReferencePads },
  {
    // Explicit custom reference: raw copper extends from -2 to +1 mm in X,
    // giving a -0.5 mm datum and +0.5 mm coaxial-axis offset after centering.
    source: "ufl_p3.2mm_pw2mm_signalw1.4mm_signalx-1.3mm",
    pads: [
      { pin: 1, x: 0.5, y: 1.6, width: 2, height: 1.1 },
      { pin: 2, x: -0.8, y: 0, width: 1.4, height: 1.1 },
      { pin: 3, x: 0.5, y: -1.6, width: 2, height: 1.1 },
    ],
  },
]

export function renderUflReferencePads(pads = uflReferencePads) {
  return pads.map((pad) => ({
    geom: jscad.primitives.cuboid({
      size: [pad.width, pad.height, 0.01],
      center: [pad.x, pad.y, -0.005],
    }),
    color: pad.pin === 1 ? [0, 255, 0] : [255, 0, 0],
  }))
}
