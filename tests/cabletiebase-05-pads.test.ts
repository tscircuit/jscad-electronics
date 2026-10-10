import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  CableTieBase,
  createCableTieBaseGeom,
  createCableTieBaseMesh,
} from "../lib/models/cabletiebase"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { source, p } from "./fixtures/cabletiebase-example"

test("cabletiebase mechanical pad policy and invalid string routing", () => {
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  expect(() => ExtrudedPads({ footprint: source + "_typo1mm" })).toThrow()
  expect(() => Footprinter3d({ footprint: source + "_typo1mm" })).toThrow()
})
