import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  createSlottedChannelGeom,
  createSlottedChannelMesh,
} from "../lib/models/slottedchannel"
import { props, source, volume } from "./fixtures/slottedchannel"
test("slottedchannel 8: built vanilla factory and string renderer are available", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createSlottedChannelMesh(props)).toEqual(
    createSlottedChannelMesh(props),
  )
  expect(
    volume(vanilla.getJscadModelForFootprintWithPads(source, jscad)),
  ).toBeCloseTo(
    jscad.measurements.measureVolume(createSlottedChannelGeom(props)),
    5,
  )
})
