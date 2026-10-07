import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  LeadScrew,
  createLeadScrewGeom,
  createLeadScrewMesh,
} from "../lib/models/leadscrew"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  leadScrewExample,
  leadScrewSingleStartExample,
} from "./fixtures/leadscrew-cases"
test("leadscrew dispatches synchronously through React and vanilla with mechanical pad policy", async () => {
  const vanilla = await importVanilla()
  for (const source of [leadScrewExample, leadScrewSingleStartExample]) {
    const model = mp.string(source).json()
    if (model.fn !== "leadscrew") throw new Error("Wrong model")
    const { fn, ...props } = model,
      geom = createLeadScrewGeom(props)
    expect(vanilla.createLeadScrewMesh(props)).toEqual(
      createLeadScrewMesh(props),
    )
    expect(ExtrudedPads({ footprint: source })).toBeNull()
    for (const result of [
      getComponentModel(LeadScrew, props),
      getComponentModel(Footprinter3d, { footprint: source }),
      vanilla.getJscadModelForFootprint(source, jscad),
      vanilla.getJscadModelForFootprintWithPads(source, jscad),
    ]) {
      expect(result.geometries).toHaveLength(1)
      const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
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
      footprint: "leadscrew_tr8x8(p2)_pitch8mm",
    }),
  ).toThrow()
})
