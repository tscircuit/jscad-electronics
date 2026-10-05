import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp, tSlotExtrusionModelPropsSchema } from "@tscircuit/modelprinter"
import {
  TSlotExtrusion,
  createTSlotExtrusionGeom,
  createTSlotExtrusionMesh,
} from "../lib/TSlotExtrusion"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  assertClosedGearMesh as assertClosedMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"

export const tSlotExtrusionExample =
  "tslotextrusion_w20mm_h20mm_l100mm_profile(fourtsolid)_slot6mm_pocket10mm_pocketd2mm_lip2mm_bore4mm_corner1mm"

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

test("T-slot extrusion defaults, unequal sections and unit inputs preserve the contract", () => {
  for (const input of [
    {},
    {
      width: "3cm",
      height: "2.4cm",
      length: "1in",
      boreDiameter: 5,
      cornerRadius: 2,
    },
  ]) {
    const props = tSlotExtrusionModelPropsSchema.parse(input)
    const mesh = createTSlotExtrusionMesh(input)
    assertClosedMesh(mesh)
    expect(meshBounds(mesh).minimum).toEqual([
      -props.width / 2,
      -props.height / 2,
      0,
    ])
    expect(meshBounds(mesh).maximum).toEqual([
      props.width / 2,
      props.height / 2,
      props.length,
    ])
  }
  expect(
    raySurfaceHits(createTSlotExtrusionMesh(), [0, 0, -1], [0, 0, 1]),
  ).toEqual([1, 101])
  expect(
    raySurfaceHits(createTSlotExtrusionMesh(), [9.8, 9.8, -1], [0, 0, 1]),
  ).toEqual([1, 101])
  expect(() => createTSlotExtrusionMesh({ pocketDepth: 3 })).toThrow()
})

test("T-slot extrusion React, footprint routing and vanilla exports agree without PCB pads", async () => {
  const model = mp.string(tSlotExtrusionExample).json()
  if (model.fn !== "tslotextrusion") throw new Error("Wrong family")
  const { fn, ...props } = model
  const vanilla = await importVanilla()
  expect(vanilla.createTSlotExtrusionMesh(props)).toEqual(
    createTSlotExtrusionMesh(props),
  )
  const geom = createTSlotExtrusionGeom(props)
  for (const result of [
    getComponentModel(TSlotExtrusion, props),
    getComponentModel(Footprinter3d, { footprint: tSlotExtrusionExample }),
    vanilla.getJscadModelForFootprintWithPads(tSlotExtrusionExample, jscad),
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
