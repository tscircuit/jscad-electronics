import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { h } from "../lib/vanilla/h"
import { Cuboid, Rotate, Translate } from "../lib/vanilla/primitives"
import { render } from "../lib/vanilla/render"

function housingBounds(rotationProps: Record<string, unknown>) {
  // The JST-PH housing is authored from Z=0..6, flipped, then lifted 6 mm.
  const node = h(
    Translate,
    { offset: [0, 0, 6] },
    h(
      Rotate,
      rotationProps,
      h(Cuboid, { size: [5.9, 4.5, 6], center: [0, 0, 3] }),
    ),
  )
  return jscad.measurements.measureBoundingBox(
    render(node, jscad).geometries[0]!.geom,
  )
}

test("vanilla Rotate accepts angles and seats a JST housing at Z=0", () => {
  const [min, max] = housingBounds({ angles: [Math.PI, 0, 0] })
  expect(min[2]).toBeCloseTo(0, 8)
  expect(max[2]).toBeCloseTo(6, 8)
})

test("vanilla Rotate preserves the rotation alias", () => {
  const [min, max] = housingBounds({ rotation: [Math.PI, 0, 0] })
  expect(min[2]).toBeCloseTo(0, 8)
  expect(max[2]).toBeCloseTo(6, 8)
})

test("vanilla Rotate preserves axis props and degree strings", () => {
  const [min, max] = housingBounds({ x: "180deg" })
  expect(min[2]).toBeCloseTo(0, 8)
  expect(max[2]).toBeCloseTo(6, 8)
})
