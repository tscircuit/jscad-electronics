import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  createHatSectionGeom,
  createHatSectionMesh,
} from "../lib/models/hatsection"
import { props, source, volume } from "./fixtures/hatsection"
test("hatsection 8: built vanilla factory and string renderer are available", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createHatSectionMesh(props)).toEqual(
    createHatSectionMesh(props),
  )
  expect(
    volume(vanilla.getJscadModelForFootprintWithPads(source, jscad)),
  ).toBeCloseTo(
    jscad.measurements.measureVolume(createHatSectionGeom(props)),
    5,
  )
})
