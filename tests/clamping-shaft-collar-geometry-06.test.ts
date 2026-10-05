import { expect, test } from "bun:test"
import {
  createClampingShaftCollarGeom,
  ClampingShaftCollar,
} from "../lib/models/clampingshaftcollar"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { importVanilla } from "./fixtures/importVanilla"
import jscad from "@jscad/modeling"
import { example, props } from "./fixtures/clamping-shaft-collar-case"

test("clampingshaftcollar: React and built vanilla APIs share geometry; mechanical dispatch emits no PCB pads", async () => {
  const node = Footprinter3d({ footprint: example })
  expect(node?.type).toBe(ClampingShaftCollar)
  expect(ExtrudedPads({ footprint: example })).toBeNull()
  const vanilla = await importVanilla()
  const direct = vanilla.createClampingShaftCollarGeom(props)
  expect(jscad.measurements.measureVolume(direct)).toBeCloseTo(
    jscad.measurements.measureVolume(createClampingShaftCollarGeom(props)),
    5,
  )
  expect(
    vanilla.getJscadModelForFootprintWithPads(example, jscad).geometries,
  ).toHaveLength(1)
})
