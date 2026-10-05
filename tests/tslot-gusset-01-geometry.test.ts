import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  createTSlotGussetGeom,
  createTSlotGussetMesh,
} from "../lib/TSlotGusset"
import {
  assertClosedGearMesh as assertClosedMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { tSlotGussetExample } from "./fixtures/tslot-gusset-example"

test("T-slot gusset has two oriented full capsule slots at the mounting positions", () => {
  const model = mp.string(tSlotGussetExample).json()
  if (model.fn !== "tslotgusset") throw new Error("Wrong family")
  const { fn, ...props } = model
  const mesh = createTSlotGussetMesh(props)
  const volume = assertClosedMesh(mesh)
  const expected = (800 - 2 * (5 * 7 + Math.PI * 2.5 ** 2)) * 4
  expect(Math.abs(volume - expected) / expected).toBeLessThan(0.001)
  expect(meshBounds(mesh).minimum).toEqual([0, 0, 0])
  expect(meshBounds(mesh).maximum).toEqual([40, 40, 4])
  for (const [x, y] of [
    [12, 3.5],
    [6.1, 3.5],
    [17.9, 3.5],
    [3.5, 28],
    [3.5, 22.1],
    [3.5, 33.9],
  ])
    expect(raySurfaceHits(mesh, [x!, y!, -1], [0, 0, 1])).toEqual([])
  for (const [x, y] of [
    [12, 0.5],
    [12, 6.5],
    [0.5, 28],
    [6.5, 28],
    [15, 15],
    [20, 19],
  ]) {
    const hits = raySurfaceHits(mesh, [x!, y!, -1], [0, 0, 1])
    expect(hits).toHaveLength(2)
    expect(hits[0]).toBeCloseTo(1, 8)
    expect(hits[1]).toBeCloseTo(5, 8)
  }
  expect(raySurfaceHits(mesh, [25, 25, -1], [0, 0, 1])).toEqual([])
  const geom = createTSlotGussetGeom(props)
  jscad.geometries.geom3.validate(geom)
  expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 5)
})
