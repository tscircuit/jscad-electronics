import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  LeadScrewNut,
  createLeadScrewNutGeom,
  createLeadScrewNutMesh,
} from "../lib/models/leadscrewnut"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  leadScrewNutExample,
  leadScrewNutCylindricalExample,
} from "./fixtures/leadscrewnut-cases"
test("leadscrewnut dispatches synchronously through React and vanilla with mechanical pad policy", async () => {
  const vanilla = await importVanilla()
  for (const source of [leadScrewNutExample, leadScrewNutCylindricalExample]) {
    const model = mp.string(source).json()
    if (model.fn !== "leadscrewnut") throw new Error("Wrong model")
    const { fn, ...props } = model,
      geom = createLeadScrewNutGeom(props)
    expect(vanilla.createLeadScrewNutMesh(props)).toEqual(
      createLeadScrewNutMesh(props),
    )
    expect(ExtrudedPads({ footprint: source })).toBeNull()
    for (const result of [
      getComponentModel(LeadScrewNut, props),
      getComponentModel(Footprinter3d, { footprint: source }),
      vanilla.getJscadModelForFootprint(source, jscad),
      vanilla.getJscadModelForFootprintWithPads(source, jscad),
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
  }
  expect(() =>
    getComponentModel(Footprinter3d, {
      footprint: "leadscrewnut_tr8x8(p2)_pitch8mm",
    }),
  ).toThrow()
})
