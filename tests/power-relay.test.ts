import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { HF32FV_PINS, HF32FVPowerRelay, PowerRelay } from "../lib/PowerRelay"
import { importVanilla } from "./fixtures/importVanilla.js"
import { getComponentModel } from "./helpers/component-model"

const boundsOf = (geom: jscad.geometries.geom3.Geom3) =>
  jscad.measurements.measureBoundingBox(geom)

test("HF32FV power relay matches the C150096 enclosure and terminal layout", () => {
  const { geometries } = getComponentModel(HF32FVPowerRelay, {})
  expect(geometries).toHaveLength(5)

  const [body, ...pins] = geometries
  const bodyBounds = boundsOf(body!.geom)
  expect(bodyBounds[1][0] - bodyBounds[0][0]).toBeCloseTo(18.4, 4)
  expect(bodyBounds[1][1] - bodyBounds[0][1]).toBeCloseTo(10.2, 4)
  expect(bodyBounds[0][2]).toBeCloseTo(0.1, 4)
  expect(bodyBounds[1][2]).toBeCloseTo(15.7, 4)

  for (const [index, pin] of pins.entries()) {
    const pinBounds = boundsOf(pin!.geom)
    const expected = HF32FV_PINS[index]!
    expect((pinBounds[0][0] + pinBounds[1][0]) / 2).toBeCloseTo(expected.x, 4)
    expect((pinBounds[0][1] + pinBounds[1][1]) / 2).toBeCloseTo(expected.y, 4)
    expect(pinBounds[1][0] - pinBounds[0][0]).toBeCloseTo(expected.width, 4)
    expect(pinBounds[1][1] - pinBounds[0][1]).toBeCloseTo(expected.depth, 4)
    expect(pinBounds[0][2]).toBeCloseTo(-3.5, 4)
    expect(pinBounds[1][2]).toBeCloseTo(0.9, 4)
    expect(
      jscad.measurements.measureVolume(
        jscad.booleans.intersect(body!.geom, pin!.geom),
      ),
    ).toBeGreaterThan(0)
  }
})

test("PowerRelay accepts alternate enclosure and terminal dimensions", () => {
  const { geometries } = getComponentModel(PowerRelay, {
    bodyLength: 20,
    bodyWidth: 12,
    bodyHeight: 16,
    bodyBottom: 0.2,
    pins: [
      { x: -8, y: 0, width: 0.6, depth: 0.6 },
      { x: 8, y: 0, width: 0.6, depth: 0.6 },
    ],
  })
  expect(geometries).toHaveLength(3)
  const bounds = boundsOf(geometries[0]!.geom)
  expect(bounds[1][0] - bounds[0][0]).toBeCloseTo(20, 4)
  expect(bounds[1][1] - bounds[0][1]).toBeCloseTo(12, 4)
  expect(bounds[1][2]).toBeCloseTo(16.2, 4)
})

test("PowerRelay rejects invalid physical dimensions", () => {
  expect(() => PowerRelay({ bodyLength: 0 })).toThrow("finite and positive")
  expect(() => PowerRelay({ pins: [] })).toThrow("at least one terminal")
})

test("the vanilla renderer exposes the explicit HF32FV model selector", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const { geometries } = getJscadModelForFootprint("powerrelay_hf32fv", jscad)
  expect(geometries).toHaveLength(5)
})
