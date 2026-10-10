import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  createPerforatedAngleGeom,
  createPerforatedAngleMesh,
} from "../lib/models/perforatedangle"
import { props, source, volume } from "./fixtures/perforatedangle"
test("perforatedangle 8: built vanilla factory and string renderer are available", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createPerforatedAngleMesh(props)).toEqual(
    createPerforatedAngleMesh(props),
  )
  expect(
    volume(vanilla.getJscadModelForFootprintWithPads(source, jscad)),
  ).toBeCloseTo(
    jscad.measurements.measureVolume(createPerforatedAngleGeom(props)),
    5,
  )
})
