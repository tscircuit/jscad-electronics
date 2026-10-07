import { expect, test } from "bun:test"
import { createShaftCollarGeom, ShaftCollar } from "../lib/models/shaftcollar"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { importVanilla } from "./fixtures/importVanilla"
import jscad from "@jscad/modeling"
import { example, props } from "./fixtures/shaft-collar-case"

test("shaftcollar: React and built vanilla APIs share geometry; mechanical dispatch emits no PCB pads", async () => {
  const node = Footprinter3d({ footprint: example })
  expect(node?.type).toBe(ShaftCollar)
  expect(ExtrudedPads({ footprint: example })).toBeNull()
  const vanilla = await importVanilla()
  const direct = vanilla.createShaftCollarGeom(props)
  expect(jscad.measurements.measureVolume(direct)).toBeCloseTo(
    jscad.measurements.measureVolume(createShaftCollarGeom(props)),
    5,
  )
  expect(
    vanilla.getJscadModelForFootprintWithPads(example, jscad).geometries,
  ).toHaveLength(1)
})
