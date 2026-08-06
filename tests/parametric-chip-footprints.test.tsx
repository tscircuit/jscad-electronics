import { expect, test } from "bun:test"
import * as jscadModeling from "@jscad/modeling"
import { createJSCADRenderer } from "jscad-fiber"
import { Footprinter3d } from "../lib/Footprinter3d"

const renderFootprint = (footprint: string) => {
  const container: any[] = []
  const { createJSCADRoot } = createJSCADRenderer(jscadModeling as any)
  createJSCADRoot(container).render(<Footprinter3d footprint={footprint} />)
  return container
}

const boundsOf = (footprint: string) => {
  const geoms = renderFootprint(footprint)
  if (geoms.length === 0) return undefined
  const [min, max] = jscadModeling.measurements.measureAggregateBoundingBox(
    ...geoms,
  )
  return {
    length: max[0]! - min[0]!,
    width: max[1]! - min[1]!,
    height: max[2]! - min[2]!,
  }
}

/**
 * Footprinter names a chip either by EIA size or by the pads it wants. The
 * parametric form carries no `imperial`, matched no case, and returned null --
 * an empty model, which renderers drop silently, so every passive authored this
 * way disappeared from the 3D view with no diagnostic.
 */
test.each([
  "res_p0.8656mm_pw0.5657mm_ph0.54mm",
  "res_p0.8402mm_pw0.5mm_ph0.54mm",
  "cap_p0.8402mm_pw0.5mm_ph0.54mm",
])("%s renders a body instead of nothing", (footprint) => {
  expect(renderFootprint(footprint).length).toBeGreaterThan(0)
})

/**
 * `case "cap"` had no `break`, so a parametric capacitor fell through into
 * `case "sot235"` and rendered a 3.4 x 2.9 x 1.35mm transistor -- a wrong model
 * being worse than a missing one, since nothing about it looks wrong.
 */
test("a parametric capacitor is a chip, not the SOT-235 it used to fall through to", () => {
  const bounds = boundsOf("cap_p0.8402mm_pw0.5mm_ph0.54mm")!

  expect(bounds.length).toBeLessThan(2)
  expect(bounds.width).toBeLessThan(2)
  // The SOT-235 body it used to produce.
  expect(bounds).not.toMatchObject({ length: 3.4, width: 2.9, height: 1.35 })
})

/**
 * The derived body is an estimate from the land pattern, so its accuracy is
 * worth stating rather than assuming: within 15% of the real chip for every EIA
 * size from 0201 up, checked by feeding each size's own land pattern back in.
 *
 * 01005 is excluded deliberately -- its land pattern is proportionally far
 * larger than the part (pitch 0.5mm for a 0.4mm body), so the estimate runs
 * ~25% over. Over-estimating the smallest chip in the catalogue is harmless;
 * pretending the estimate is exact would not be.
 */
test.each([
  ["0201", 0.66, 0.4, 0.6, 0.3],
  ["0402", 1.02, 0.64, 1.0, 0.5],
  ["0603", 1.65, 0.95, 1.6, 0.8],
  ["0805", 1.825, 1.4, 2.0, 1.25],
  ["1206", 2.925, 1.75, 3.2, 1.6],
  ["1210", 2.925, 2.65, 3.2, 2.5],
  ["2010", 4.625, 2.65, 5.0, 2.5],
  ["2512", 5.925, 3.35, 6.35, 3.2],
] as const)(
  "a %s land pattern derives a body within 15% of the real part",
  (_size, padPitch, padHeight, realLength, realWidth) => {
    const bounds = boundsOf(`res_p${padPitch}mm_pw0.5mm_ph${padHeight}mm`)!

    expect(Math.abs(bounds.length - realLength) / realLength).toBeLessThan(0.15)
    expect(Math.abs(bounds.width - realWidth) / realWidth).toBeLessThan(0.15)
  },
)

/**
 * Named sizes keep their hand-modelled bodies: this only fills the gap where
 * there was nothing, and must not start approximating parts that were already
 * right.
 */
test.each([
  ["0402", 1.0, 0.5],
  ["0603", 1.6, 0.85],
  ["1210", 3.2, 2.5],
])("%s still uses its exact hand-modelled body", (footprint, length, width) => {
  const bounds = boundsOf(footprint)!

  expect(bounds.length).toBeCloseTo(length)
  expect(bounds.width).toBeCloseTo(width)
})

/**
 * Footprinter accepts inches in the same position and passes them through
 * unconverted, so the body has to be parsed with the same `mm` the pads were.
 * A 0.1in pitch is 2.54mm; a naive `parseFloat` would build a 0.1mm chip.
 */
test("an inch-parameterised chip is measured in millimetres", () => {
  const bounds = boundsOf("res_p0.1in_pw0.02in_ph0.05in")!

  expect(bounds.length).toBeCloseTo(2.54)
  expect(bounds.width).toBeCloseTo(0.05 * 25.4 * 0.85)
})

/**
 * The parametric path is keyed on the chip functions, not on the presence of a
 * pitch: plenty of footprints carry a `p`, and a pin header is not a chip.
 */
test("a pin header is not treated as a chip", () => {
  const bounds = boundsOf("pinrow4")!

  expect(bounds.length).toBeCloseTo(10.16)
  expect(renderFootprint("pinrow4").length).toBeGreaterThan(3)
})
