import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  TSlotGusset,
  createTSlotGussetGeom,
  createTSlotGussetMesh,
} from "../lib/TSlotGusset"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { tSlotGussetExample } from "./fixtures/tslot-gusset-example"

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
