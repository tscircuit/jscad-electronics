import { expect, test } from "bun:test"
import type { FlangedBushingModelPropsInput } from "@tscircuit/modelprinter"
import {
  createFlangedBushingGeom,
  createFlangedBushingMesh,
} from "../lib/models/flangedbushing"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { source } from "./fixtures/flanged-bushing-cases"

test("flanged bushing consumes modelprinter validation and rejects impossible flange dimensions", () => {
  for (const extra of [
    { innerDiameter: 0 },
    { outerDiameter: 8 },
    { flangeDiameter: 12 },
    { flangeThickness: 0 },
    { flangeThickness: 15 },
    { flangeThickness: 16 },
    { length: Infinity },
    { length: "15mmjunk" },
    { style: "split" },
    { unexpected: 1 },
  ]) {
    const props = {
      innerDiameter: 8,
      outerDiameter: 12,
      flangeDiameter: 18,
      length: 15,
      flangeThickness: 2,
      ...extra,
    }
    expect(() =>
      createFlangedBushingMesh(props as FlangedBushingModelPropsInput),
    ).toThrow()
    expect(() =>
      createFlangedBushingGeom(props as FlangedBushingModelPropsInput),
    ).toThrow()
  }
  expect(() => Footprinter3d({ footprint: source + "_flangeod20mm" })).toThrow()
  expect(() =>
    ExtrudedPads({
      footprint:
        "flangedbushing_id8mm_od12mm_flangeod18mm_l2mm_flangethickness2mm",
    }),
  ).toThrow()
})
