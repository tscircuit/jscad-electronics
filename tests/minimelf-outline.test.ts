import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { fp } from "@tscircuit/footprinter"
import { FootprintPad } from "../lib/FootprintPad"
import { MINIMELF } from "../lib/MINIMELF"
import { getComponentModel } from "./helpers/component-model"

test("MiniMELF has flush end contacts seated on both SOD-80 lands", () => {
  const { geometries } = getComponentModel(MINIMELF, {})
  expect(geometries).toHaveLength(4)
  const [min, max] = jscad.measurements.measureAggregateBoundingBox(
    ...geometries.map(({ geom }) => geom),
  )
  expect(max[0] - min[0]).toBeCloseTo(3.5, 5)
  expect(max[1] - min[1]).toBeCloseTo(1.54, 5)
  expect(max[2] - min[2]).toBeCloseTo(1.54, 5)
  expect(min[2]).toBeCloseTo(-0.02, 5)
  const [bandMin] = jscad.measurements.measureBoundingBox(geometries[1]!.geom)
  const [, cathodeContactMax] = jscad.measurements.measureBoundingBox(
    geometries[2]!.geom,
  )
  expect(bandMin[0] - cathodeContactMax[0]).toBeGreaterThan(0.2)
  for (const { geom } of geometries) {
    expect(Number.isFinite(jscad.measurements.measureVolume(geom))).toBe(true)
    expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
  }
  const pads = fp
    .string("sod80_p3.5301mm_pl1.44mm_pw1.62mm")
    .circuitJson()
    .filter(
      (element) => element.type === "pcb_smtpad" && element.shape === "rect",
    )
  expect(pads).toHaveLength(2)
  for (const { geom } of geometries.slice(2)) {
    const [contactMin, contactMax] = jscad.measurements.measureBoundingBox(geom)
    expect(contactMax[0] - contactMin[0]).toBeLessThanOrEqual(0.47)
    expect(
      jscad.measurements.measureVolume(
        jscad.booleans.intersect(geometries[0]!.geom, geom),
      ),
    ).toBeGreaterThan(0)
    const matchingPad = pads.find(
      (pad) => Math.sign(pad.x) === Math.sign(contactMin[0]),
    )
    if (!matchingPad)
      throw new Error("Expected a land below each MiniMELF contact")
    const padGeometry = getComponentModel(FootprintPad, {
      pad: matchingPad,
    }).geometries[0]
    if (!padGeometry) throw new Error("Expected pad geometry")
    expect(
      jscad.measurements.measureVolume(
        jscad.booleans.intersect(geom, padGeometry.geom),
      ),
    ).toBeGreaterThan(0)
  }
})
