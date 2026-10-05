import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp, tSlotGussetModelPropsSchema } from "@tscircuit/modelprinter"
import {
  TSlotGusset,
  createTSlotGussetGeom,
  createTSlotGussetMesh,
} from "../lib/TSlotGusset"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  assertClosedGearMesh as assertClosedMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"

export const tSlotGussetExample =
  "tslotgusset_w40mm_h40mm_t4mm_shape(righttriangle)_slots2_slot(5mm,12mm)_centers(12mm,28mm)"

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

test("T-slot gusset defaults, unequal triangles, unit tuples and round slots are closed", () => {
  for (const input of [
    {},
    {
      width: "5cm",
      height: "4.5cm",
      thickness: "0.1in",
      slot: ["0.5cm", "1.2cm"] as [string, string],
    },
    { slot: [5, 5] as [number, number] },
  ]) {
    const props = tSlotGussetModelPropsSchema.parse(input)
    const mesh = createTSlotGussetMesh(input)
    assertClosedMesh(mesh)
    expect(meshBounds(mesh).minimum).toEqual([0, 0, 0])
    expect(meshBounds(mesh).maximum).toEqual([
      props.width,
      props.height,
      props.thickness,
    ])
  }
  expect(() => createTSlotGussetMesh({ centers: [12, 31] })).toThrow()
})

test("T-slot gusset React, footprint routing and vanilla exports agree without PCB pads", async () => {
  const model = mp.string(tSlotGussetExample).json()
  if (model.fn !== "tslotgusset") throw new Error("Wrong family")
  const { fn, ...props } = model
  const vanilla = await importVanilla()
  expect(vanilla.createTSlotGussetMesh(props)).toEqual(
    createTSlotGussetMesh(props),
  )
  const geom = createTSlotGussetGeom(props)
  for (const result of [
    getComponentModel(TSlotGusset, props),
    getComponentModel(Footprinter3d, { footprint: tSlotGussetExample }),
    vanilla.getJscadModelForFootprintWithPads(tSlotGussetExample, jscad),
  ]) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    jscad.geometries.geom3.validate(solid)
    expect(jscad.measurements.measureBoundingBox(solid)).toEqual(
      jscad.measurements.measureBoundingBox(geom),
    )
    expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(
      jscad.measurements.measureVolume(geom),
      6,
    )
  }
})
