import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { Footprinter3d, type Footprinter3dModel } from "../lib/Footprinter3d"
import { SSOP } from "../lib/SSOP"
import { LGA } from "../lib/LGA"
import { SOT89, sot89NominalDimensions } from "../lib/SOT89"
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
test("nominal sot89 uses the three-terminal model, including customized copper", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  const expected = metrics(
    getComponentModel(SOT89, sot89NominalDimensions).geometries.map(
      (g) => g.geom,
    ),
  )
  for (const footprint of ["sot89", "sot89_p1.5mm_pw0.67mm_pl1.56mm"]) {
    const solids = get(footprint, jscad).geometries.map((g: any) => g.geom)
    expect(solids.length).toBe(expected.count)
    const box = metrics(solids).box
    for (let axis = 0; axis < 3; axis++)
      expect(box[1][axis]! - box[0][axis]!).toBeCloseTo(
        expected.box[1][axis]! - expected.box[0][axis]!,
        5,
      )
  }
  expect(get("sot89_5", jscad).geometries.length).toBeGreaterThan(0)
})
test("explicit models do not register invented footprint strings or suffix routing", async () => {
  const { getJscadModelForFootprint: get } = await importVanilla()
  const model = variants["TO277 explicit package"].model
  expect(() => get("to277", jscad, { model })).toThrow()
  expect(() =>
    get("smdpads2", jscad, { model: { type: "unknown", props: {} } }),
  ).toThrow()
  expect(get("smdpads2_to277", jscad).geometries).toHaveLength(0)
  expect(get("smdpads2", jscad, { model }).geometries).toHaveLength(4)
})
// Compile-time guard: each discriminator requires its own dimensional schema.
const checkTypes = () => {
  // @ts-expect-error Missing required physical dimensions
  const missing: Footprinter3dModel = { type: "to277", props: {} }
  // @ts-expect-error A footprint is not a package model discriminator
  const invalid: Footprinter3dModel = { type: "dpak", props: {} }
  return [missing, invalid]
}
void checkTypes

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
