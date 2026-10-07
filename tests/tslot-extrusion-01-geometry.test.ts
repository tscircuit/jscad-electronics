import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  createTSlotExtrusionGeom,
  createTSlotExtrusionMesh,
} from "../lib/models/tslotextrusion"
import {
  assertClosedGearMesh as assertClosedMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { tSlotExtrusionExample } from "./fixtures/tslot-extrusion-example"

test("T-slot extrusion has four through grooves, rounded corners and open axial bore", () => {
  const model = mp.string(tSlotExtrusionExample).json()
  if (model.fn !== "tslotextrusion") throw new Error("Wrong family")
  const { fn, ...props } = model
  const mesh = createTSlotExtrusionMesh(props)
  const volume = assertClosedMesh(mesh)
  const expected =
    (400 - 4 * (6 * 2 + 10 * 2) - (4 - Math.PI) - Math.PI * 4) * 100
  expect(Math.abs(volume - expected) / expected).toBeLessThan(0.001)
  expect(meshBounds(mesh).minimum).toEqual([-10, -10, 0])
  expect(meshBounds(mesh).maximum).toEqual([10, 10, 100])
  for (const [x, y] of [
    [0, 0],
    [0, -9],
    [4, -7],
    [9, 0],
    [7, 4],
    [0, 9],
    [-4, 7],
    [-9, 0],
    [-7, -4],
    [9.8, 9.8],
  ])
    expect(raySurfaceHits(mesh, [x!, y!, -1], [0, 0, 1])).toEqual([])
  for (const [x, y] of [
    [3, 0],
    [4, -9],
    [9, 4],
    [-4, 9],
    [-9, -4],
  ])
    expect(raySurfaceHits(mesh, [x!, y!, -1], [0, 0, 1])).toEqual([1, 101])
  const geom = createTSlotExtrusionGeom(props)
  jscad.geometries.geom3.validate(geom)
  expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 5)
})
