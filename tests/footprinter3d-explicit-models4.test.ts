import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { Footprinter3d, type Footprinter3dModel } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
function metrics(solids: jscad.geometries.geom3.Geom3[]) {
  return {
    count: solids.length,
    box: jscad.measurements.measureAggregateBoundingBox(...solids),
    volumes: solids.map((s) => jscad.measurements.measureVolume(s)),
  }
}
test("earlier standard model families also forward explicit props", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  const cases = [
    ["soic", "SOIC", "SOIC", "soic-variants", "soicVariants"],
    ["msop", "MSOP", "MSOP", "msop-variants", "msopVariants"],
    ["tssop", "Tssop", "Tssop", "tssop-variants", "tssopVariants"],
    ["qfn", "QFN", "qfn", "qfn-physical-variants", "qfnPhysicalVariants"],
    ["lqfp", "LQFP", "lqfp", "lqfp-physical-variants", "lqfpPhysicalVariants"],
    ["dfn", "DFN", "dfn", "dfn-variants", "dfnVariants"],
    ["do219ad", "DO219AD", "DO219AD", "do219ad-variants", "do219adVariants"],
    [
      "sod323he",
      "SOD323HE",
      "SOD323HE",
      "sod323he-variants",
      "sod323heVariants",
    ],
  ] as const
  for (const [type, component, module, fixtureModule, fixtureExport] of cases) {
    const Component = (await import(`../lib/${module}.tsx`))[component]
    const fixture = Object.values(
      (await import(`../examples/fixtures/${fixtureModule}.ts`))[fixtureExport],
    )[0] as { footprint: string; props: object }
    const model = { type, props: fixture.props } as Footprinter3dModel
    const direct = getComponentModel(Component, fixture.props).geometries.map(
      (g) => g.geom,
    )
    const wrapped = getComponentModel(Footprinter3d, {
      footprint: fixture.footprint,
      model,
    }).geometries.map((g) => g.geom)
    expect(metrics(wrapped)).toEqual(metrics(direct))
    expect(get(fixture.footprint, jscad, { model }).geometries.length).toBe(
      direct.length,
    )
  }
})
