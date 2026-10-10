import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  createCornerFootMesh,
  createCornerFootGeom,
} from "../lib/models/cornerfoot"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  cornerFootProps,
  cornerFootSource,
} from "./fixtures/cornerfoot-example"
test("cornerfoot built vanilla factories and footprint dispatch agree", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createCornerFootMesh(cornerFootProps)).toEqual(
    createCornerFootMesh(cornerFootProps),
  )
  const result = vanilla.getJscadModelForFootprintWithPads(
    cornerFootSource,
    jscad,
  )
  expect(result.geometries.length).toBe(1)
  expect(
    jscad.measurements.measureVolume(result.geometries[0]!.geom),
  ).toBeCloseTo(
    jscad.measurements.measureVolume(createCornerFootGeom(cornerFootProps)),
    6,
  )
})
