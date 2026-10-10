import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  createTSlotPanelRetainerGeom,
  createTSlotPanelRetainerMesh,
} from "../lib/models/tslotpanelretainer"
import { props, source, volume } from "./fixtures/tslotpanelretainer"
test("tslotpanelretainer 8: built vanilla factory and string renderer are available", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createTSlotPanelRetainerMesh(props)).toEqual(
    createTSlotPanelRetainerMesh(props),
  )
  expect(
    volume(vanilla.getJscadModelForFootprintWithPads(source, jscad)),
  ).toBeCloseTo(
    jscad.measurements.measureVolume(createTSlotPanelRetainerGeom(props)),
    5,
  )
})
