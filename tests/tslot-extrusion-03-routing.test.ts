import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  TSlotExtrusion,
  createTSlotExtrusionGeom,
  createTSlotExtrusionMesh,
} from "../lib/TSlotExtrusion"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { tSlotExtrusionExample } from "./fixtures/tslot-extrusion-example"

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
