import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp, tSlotInsideCornerModelPropsSchema } from "@tscircuit/modelprinter"
import {
  TSlotInsideCorner,
  createTSlotInsideCornerGeom,
  createTSlotInsideCornerMesh,
} from "../lib/TSlotInsideCorner"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  assertClosedGearMesh as assertClosedMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"

export const tSlotInsideCornerExample =
  "tslotinsidecorner_w20mm_leg40mm_t4mm_angle90deg_holes2_hole5mm_offset20mm_bendr1mm"

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

test("T-slot inside corner sharp-inside default and inch inputs retain welded seams", () => {
  for (const input of [
    {},
    {
      width: "1in",
      legLength: "2in",
      thickness: "0.1in",
      bendRadius: "0.2in",
      holeDiameter: "0.2in",
      holeOffset: "1in",
    },
  ]) {
    const props = tSlotInsideCornerModelPropsSchema.parse(input)
    const mesh = createTSlotInsideCornerMesh(input)
    assertClosedMesh(mesh)
    expect(meshBounds(mesh).minimum).toEqual([
      -props.thickness,
      -props.width / 2,
      -props.thickness,
    ])
    expect(meshBounds(mesh).maximum).toEqual([
      props.legLength,
      props.width / 2,
      props.legLength,
    ])
  }
  expect(() => createTSlotInsideCornerMesh({ holeOffset: 2 })).toThrow()
})

test("T-slot inside corner React, footprint routing and vanilla agree without PCB pads", async () => {
  const model = mp.string(tSlotInsideCornerExample).json()
  if (model.fn !== "tslotinsidecorner") throw new Error("Wrong family")
  const { fn, ...props } = model
  const vanilla = await importVanilla()
  expect(vanilla.createTSlotInsideCornerMesh(props)).toEqual(
    createTSlotInsideCornerMesh(props),
  )
  const geom = createTSlotInsideCornerGeom(props)
  for (const result of [
    getComponentModel(TSlotInsideCorner, props),
    getComponentModel(Footprinter3d, { footprint: tSlotInsideCornerExample }),
    vanilla.getJscadModelForFootprintWithPads(tSlotInsideCornerExample, jscad),
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
