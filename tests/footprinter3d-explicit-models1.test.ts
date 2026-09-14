import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { Footprinter3d } from "../lib/Footprinter3d"
import { SSOP } from "../lib/SSOP"
import { LGA } from "../lib/LGA"
import { SOT89 } from "../lib/SOT89"
import { TO277 } from "../lib/TO277"
import { footprinter3dModelVariants as variants } from "../examples/fixtures/footprinter3d-model-variants"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
const components = { ssop: SSOP, lga: LGA, sot89: SOT89, to277: TO277 }
function metrics(solids: jscad.geometries.geom3.Geom3[]) {
  return {
    count: solids.length,
    box: jscad.measurements.measureAggregateBoundingBox(...solids),
    volumes: solids.map((s) => jscad.measurements.measureVolume(s)),
  }
}
test("explicit Footprinter3d models match standalone geometry in React and vanilla", async () => {
  const {
    getJscadModelForFootprint: get,
    getJscadModelForFootprintWithPads: withPads,
  } = await importVanilla()
  for (const v of Object.values(variants)) {
    if (!("model" in v)) continue
    const direct = getComponentModel(
      components[v.model.type] as any,
      v.model.props,
    ).geometries.map((g) => g.geom)
    const wrapped = getComponentModel(Footprinter3d, v).geometries.map(
      (g) => g.geom,
    )
    expect(metrics(wrapped)).toEqual(metrics(direct))
    const vanilla = get(v.footprint, jscad, { model: v.model }).geometries.map(
      (g: any) => g.geom,
    )
    const a = metrics(vanilla),
      b = metrics(direct)
    expect(a.count).toBe(b.count)
    for (let axis = 0; axis < 3; axis++)
      for (let end = 0; end < 2; end++)
        expect(a.box[end]![axis]).toBeCloseTo(b.box[end]![axis]!, 5)
    for (let i = 0; i < a.count; i++)
      expect(a.volumes[i]).toBeCloseTo(b.volumes[i]!, 5)
    expect(
      withPads(v.footprint, jscad, { model: v.model }).geometries.length,
    ).toBeGreaterThan(a.count)
  }
})
