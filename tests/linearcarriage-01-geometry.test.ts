import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  assertClosedGearMesh as assertClosedMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import {
  createLinearCarriageMesh,
  createLinearCarriageGeom,
} from "../lib/models/linearcarriage"

const expectDistances = (actual: number[], expected: number[]) => {
  expect(actual).toHaveLength(expected.length)
  expected.forEach((distance, index) =>
    expect(actual[index]!).toBeCloseTo(distance, 8),
  )
}

test("generic carriage has a full waisted channel, retaining lips and flat blind mounting floors", () => {
  const mesh = createLinearCarriageMesh()
  const volume = assertClosedMesh(mesh)
  const bounds = meshBounds(mesh)
  for (const [i, value] of [-13.5, -22.5, 2.15].entries())
    expect(bounds.minimum[i]!).toBeCloseTo(value, 8)
  expect(bounds.maximum).toEqual([13.5, 22.5, 13])
  const expected =
    (27 * (13 - 2.15) - 8.3 * (3.85 - 2.15) - 12.3 * (8.15 - 3.85)) * 45 -
    4 * Math.PI * 1.5 ** 2 * 4
  expect(Math.abs(volume - expected) / expected).toBeLessThan(0.001)
  for (const z of [3, 6])
    expect(raySurfaceHits(mesh, [0, -30, z], [0, 1, 0])).toEqual([])
  expectDistances(raySurfaceHits(mesh, [5, -30, 3], [0, 1, 0]), [7.5, 52.5])
  expect(raySurfaceHits(mesh, [5, -30, 6], [0, 1, 0])).toEqual([])
  expectDistances(raySurfaceHits(mesh, [0, -30, 10], [0, 1, 0]), [7.5, 52.5])
  for (const x of [-10, 10])
    for (const y of [-10, 10]) {
      const hits = raySurfaceHits(mesh, [x, y, 0], [0, 0, 1])
      expect(hits).toHaveLength(2)
      expect(hits[0]).toBeCloseTo(2.15, 8)
      expect(hits[1]).toBeCloseTo(9, 8)
    }
  const geom = createLinearCarriageGeom()
  jscad.geometries.geom3.validate(geom)
  expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
})
