import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
import { createZeeBarGeom, createZeeBarMesh } from "../lib/models/zeebar"
import { props, source, volume } from "./fixtures/zeebar"
test("zeebar 8: built vanilla factory and string renderer are available", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createZeeBarMesh(props)).toEqual(createZeeBarMesh(props))
  expect(
    volume(vanilla.getJscadModelForFootprintWithPads(source, jscad)),
  ).toBeCloseTo(jscad.measurements.measureVolume(createZeeBarGeom(props)), 5)
})
