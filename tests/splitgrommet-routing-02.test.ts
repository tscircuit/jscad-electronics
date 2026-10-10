import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  createSplitGrommetMesh,
  createSplitGrommetGeom,
} from "../lib/models/splitgrommet"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  splitGrommetProps,
  splitGrommetSource,
} from "./fixtures/splitgrommet-example"
test("splitgrommet built vanilla factories and footprint dispatch agree", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createSplitGrommetMesh(splitGrommetProps)).toEqual(
    createSplitGrommetMesh(splitGrommetProps),
  )
  const result = vanilla.getJscadModelForFootprintWithPads(
    splitGrommetSource,
    jscad,
  )
  expect(result.geometries.length).toBe(1)
  expect(
    jscad.measurements.measureVolume(result.geometries[0]!.geom),
  ).toBeCloseTo(
    jscad.measurements.measureVolume(createSplitGrommetGeom(splitGrommetProps)),
    6,
  )
})
