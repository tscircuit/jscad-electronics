import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  assertClosedGearMesh as assertClosedMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import {
  createLinearRailMesh,
  createLinearRailGeom,
} from "../lib/models/linearrail"

const expectDistances = (actual: number[], expected: number[]) => {
  expect(actual).toHaveLength(expected.length)
  expected.forEach((distance, index) =>
    expect(actual[index]!).toBeCloseTo(distance, 8),
  )
}

test("generic rail retains the waisted section, through holes and recessed counterbores", () => {
  const mesh = createLinearRailMesh()
  const volume = assertClosedMesh(mesh)
  expect(meshBounds(mesh).minimum).toEqual([-6, 0, 0])
  expect(meshBounds(mesh).maximum).toEqual([6, 100, 8])
  const expected =
    (12 * 2 + 8 * 2 + 12 * 4 - 0.5 ** 2) * 100 -
    4 * (Math.PI * 1.75 ** 2 * 8 + Math.PI * (3 ** 2 - 1.75 ** 2) * 3)
  expect(Math.abs(volume - expected) / expected).toBeLessThan(0.001)
  for (const y of [12.5, 37.5, 62.5, 87.5]) {
    expect(raySurfaceHits(mesh, [0, y, -1], [0, 0, 1])).toEqual([])
    expectDistances(raySurfaceHits(mesh, [2.5, y, -1], [0, 0, 1]), [1, 6])
  }
  expect(raySurfaceHits(mesh, [4.5, -1, 3], [0, 1, 0])).toEqual([])
  expectDistances(raySurfaceHits(mesh, [4.5, -1, 6], [0, 1, 0]), [1, 101])
  expect(raySurfaceHits(mesh, [5.8, -1, 7.8], [0, 1, 0])).toEqual([])
  const geom = createLinearRailGeom()
  jscad.geometries.geom3.validate(geom)
  expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
})
