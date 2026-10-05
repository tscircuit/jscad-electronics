import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  createTSlotInsideCornerGeom,
  createTSlotInsideCornerMesh,
} from "../lib/models/tslotinsidecorner"
import {
  assertClosedGearMesh as assertClosedMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { tSlotInsideCornerExample } from "./fixtures/tslot-inside-corner-example"

test("T-slot inside corner has a constant-thickness quarter bend and two perpendicular through holes", () => {
  const model = mp.string(tSlotInsideCornerExample).json()
  if (model.fn !== "tslotinsidecorner") throw new Error("Wrong family")
  const { fn, ...props } = model
  const mesh = createTSlotInsideCornerMesh(props)
  const volume = assertClosedMesh(mesh)
  const expected =
    20 * (2 * 39 * 4 + (Math.PI * (25 - 1)) / 4) - 2 * Math.PI * 2.5 ** 2 * 4
  expect(Math.abs(volume - expected) / expected).toBeLessThan(0.001)
  expect(meshBounds(mesh).minimum).toEqual([-4, -10, -4])
  expect(meshBounds(mesh).maximum).toEqual([40, 10, 40])
  expect(raySurfaceHits(mesh, [20, 0, -5], [0, 0, 1])).toEqual([])
  expect(raySurfaceHits(mesh, [-5, 0, 20], [1, 0, 0])).toEqual([])
  expect(raySurfaceHits(mesh, [20, 3, -5], [0, 0, 1])).toEqual([1, 5])
  expect(raySurfaceHits(mesh, [-5, 3, 20], [1, 0, 0])).toEqual([1, 5])
  const radial: [number, number, number] = [-Math.SQRT1_2, 0, -Math.SQRT1_2]
  const bendHits = raySurfaceHits(mesh, [1, 0, 1], radial)
  expect(bendHits).toHaveLength(2)
  expect(bendHits[0]).toBeCloseTo(1, 5)
  expect(bendHits[1]).toBeCloseTo(5, 5)
  const geom = createTSlotInsideCornerGeom(props)
  jscad.geometries.geom3.validate(geom)
  expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 5)
})
