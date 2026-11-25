import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
test("midmount shell is hollow with twelve tails and four tabs", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  const { geometries } = get("usbcmidmount16", jscad)
  expect(geometries.length).toBe(37)
  for (const { geom } of geometries)
    expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
  const shell = geometries[0]!.geom
  const probe = jscad.primitives.cuboid({
    size: [1, 2, 0.3],
    center: [0, -4, 2.5],
  })
  expect(
    jscad.measurements.measureVolume(jscad.booleans.intersect(shell, probe)),
  ).toBeCloseTo(0, 5)
  const bounds = jscad.measurements.measureBoundingBox(shell)
  expect(bounds[1][0] - bounds[0][0]).toBeCloseTo(8.94, 2)
  expect(bounds[1][2] - bounds[0][2]).toBeCloseTo(3.2, 2)
  const tabs = geometries.slice(-4)
  for (const { geom } of tabs)
    expect(jscad.measurements.measureBoundingBox(geom)[0][2]).toBeLessThan(0)
})

test("dimensions measured from the shell lip set the cavity, tongue and contacts", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  const base = "usbcmidmount16_bodybottom5.35mm"
  const { geometries } = get(
    base +
      "_shelldepth7.3mm_shellwall300um_cavitydepth4mm_tonguesetback0.3mm_tonguethickness0.62mm",
    jscad,
  )
  const [shell, tongue, rear] = geometries
  const bounds = jscad.measurements.measureBoundingBox
  const [shellMin, shellMax] = bounds(shell!.geom)
  expect(shellMin[1]).toBeCloseTo(-5.35, 4)
  expect(shellMax[1]).toBeCloseTo(1.95, 4)
  const [tongueMin, tongueMax] = bounds(tongue!.geom)
  expect(tongueMin[1] - shellMin[1]).toBeCloseTo(0.3, 4)
  expect(tongueMax[1] - shellMin[1]).toBeCloseTo(4, 4)
  expect(tongueMax[2] - tongueMin[2]).toBeCloseTo(0.62, 4)
  const [rearMin, rearMax] = bounds(rear!.geom)
  expect(rearMin[1]).toBeCloseTo(tongueMax[1], 4)
  expect(rearMax[1]).toBeCloseTo(shellMax[1], 4)

  // A 1 mm² column through the flat roof cuts exactly one wall thickness.
  const roofProbe = jscad.primitives.cuboid({
    size: [1, 1, 1],
    center: [0, -3, 3.25],
  })
  expect(
    jscad.measurements.measureVolume(
      jscad.booleans.intersect(shell!.geom, roofProbe),
    ),
  ).toBeCloseTo(0.3, 4)

  const legacy = get(base, jscad).geometries
  // The physical contacts on the tongue follow its two faces.
  for (const { geom } of geometries.slice(5, 21)) {
    const [min, max] = bounds(geom)
    expect(min[1]).toBeGreaterThanOrEqual(tongueMin[1])
    expect(max[1]).toBeLessThanOrEqual(tongueMax[1])
    expect(
      jscad.measurements.measureVolume(
        jscad.booleans.intersect(tongue!.geom, geom),
      ),
    ).toBeGreaterThan(0)
  }
  // The locating pegs, twelve solder tails and four tabs still fit the same board.
  for (const index of [3, 4, ...Array.from({ length: 16 }, (_, i) => 21 + i)]) {
    expect(bounds(geometries[index]!.geom)).toEqual(bounds(legacy[index]!.geom))
  }
})

test.each([
  "shellwall2mm",
  "tonguethickness4mm",
  "shelldepth4mm_cavitydepth5mm",
  "cavitydepth3mm_tonguesetback3mm",
])("rejects impossible USB-C geometry: %s", async (fields) => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  expect(() => get("usbcmidmount16_" + fields, jscad)).toThrow()
})
