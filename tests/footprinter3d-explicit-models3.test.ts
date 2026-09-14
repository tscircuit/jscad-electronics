import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { type Footprinter3dModel } from "../lib/Footprinter3d"
import { footprinter3dModelVariants as variants } from "../examples/fixtures/footprinter3d-model-variants"
import { importVanilla } from "./fixtures/importVanilla.js"
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
