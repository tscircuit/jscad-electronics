import { expect, test } from "bun:test"
import type { PlainBushingModelPropsInput } from "@tscircuit/modelprinter"
import {
  createPlainBushingGeom,
  createPlainBushingMesh,
} from "../lib/models/plainbushing"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { source } from "./fixtures/plain-bushing-cases"

test("plain bushing shares modelprinter validation without renderer defaults", () => {
  for (const extra of [
    { innerDiameter: 0 },
    { outerDiameter: 8 },
    { edgeChamfer: 1 },
    { length: 1, edgeChamfer: 0.5 },
    { length: Infinity },
    { length: "20mmjunk" },
    { style: "split" },
    { unexpected: 1 },
  ]) {
    const props = { innerDiameter: 8, outerDiameter: 12, length: 20, ...extra }
    expect(() =>
      createPlainBushingMesh(props as PlainBushingModelPropsInput),
    ).toThrow()
    expect(() =>
      createPlainBushingGeom(props as PlainBushingModelPropsInput),
    ).toThrow()
  }
  expect(() => Footprinter3d({ footprint: source + "_id9mm" })).toThrow()
  expect(() =>
    ExtrudedPads({ footprint: "plainbushing_id8mm_od8mm_l20mm" }),
  ).toThrow()
})
