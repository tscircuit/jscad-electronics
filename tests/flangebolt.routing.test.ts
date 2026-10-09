import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { FlangeBolt, createFlangeBoltGeom } from "../lib/models/flangebolt"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
test("flangebolt React and vanilla dispatch preserve actual geometry and omit electrical pads", async () => {
  const source =
      "flangebolt_headstandard(iso4162)_m6_l25mm_fullthread_plainface",
    model = mp.string(source).json()
  if (model.fn !== "flangebolt") throw new Error("Wrong family")
  const { fn, ...props } = model,
    geom = createFlangeBoltGeom(props)
  jscad.geometries.geom3.validate(geom)
  const bounds = jscad.measurements.measureBoundingBox(geom),
    volume = jscad.measurements.measureVolume(geom)
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const vanilla = await importVanilla()
  for (const result of [
    getComponentModel(FlangeBolt, props),
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
