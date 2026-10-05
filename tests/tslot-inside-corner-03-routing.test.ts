import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  TSlotInsideCorner,
  createTSlotInsideCornerGeom,
  createTSlotInsideCornerMesh,
} from "../lib/TSlotInsideCorner"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { tSlotInsideCornerExample } from "./fixtures/tslot-inside-corner-example"

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
