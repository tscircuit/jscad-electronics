import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  createKeyWasherMesh,
  createKeyWasherGeom,
} from "../lib/models/keywasher"
import { importVanilla } from "./fixtures/importVanilla.js"
import { keyWasherProps, keyWasherSource } from "./fixtures/keywasher-example"
test("keywasher built vanilla factories and footprint dispatch agree", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createKeyWasherMesh(keyWasherProps)).toEqual(
    createKeyWasherMesh(keyWasherProps),
  )
  const result = vanilla.getJscadModelForFootprintWithPads(
    keyWasherSource,
    jscad,
  )
  expect(result.geometries.length).toBe(1)
  expect(
    jscad.measurements.measureVolume(result.geometries[0]!.geom),
  ).toBeCloseTo(
    jscad.measurements.measureVolume(createKeyWasherGeom(keyWasherProps)),
    6,
  )
})
