import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  HeatSetInsert,
  createHeatSetInsertGeom,
} from "../lib/models/heatsetinsert"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
test("heatsetinsert React and vanilla dispatch preserve actual geometry and omit electrical pads", async () => {
  const source =
      "heatsetinsert_m3_od4.6mm_l5mm_knurldepth0.2mm_knurlp0.6mm_knurlteeth24_diamondknurl",
    model = mp.string(source).json()
  if (model.fn !== "heatsetinsert") throw new Error("Wrong family")
  const { fn, ...props } = model,
    geom = createHeatSetInsertGeom(props)
  jscad.geometries.geom3.validate(geom)
  const bounds = jscad.measurements.measureBoundingBox(geom),
    volume = jscad.measurements.measureVolume(geom)
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const vanilla = await importVanilla()
  for (const result of [
    getComponentModel(HeatSetInsert, props),
    getComponentModel(Footprinter3d, { footprint: source }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
  ]) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    jscad.geometries.geom3.validate(solid)
    expect(jscad.measurements.measureBoundingBox(solid)).toEqual(bounds)
    expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(volume, 6)
  }
}, 30000)
