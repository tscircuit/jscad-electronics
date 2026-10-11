import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  createFlatGasketMesh,
  createFlatGasketGeom,
} from "../lib/models/flatgasket"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  flatGasketProps,
  flatGasketSource,
} from "./fixtures/flatgasket-example"
test("flatgasket built vanilla factories and footprint dispatch agree", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createFlatGasketMesh(flatGasketProps)).toEqual(
    createFlatGasketMesh(flatGasketProps),
  )
  const result = vanilla.getJscadModelForFootprintWithPads(
    flatGasketSource,
    jscad,
  )
  expect(result.geometries.length).toBe(1)
  expect(
    jscad.measurements.measureVolume(result.geometries[0]!.geom),
  ).toBeCloseTo(
    jscad.measurements.measureVolume(createFlatGasketGeom(flatGasketProps)),
    6,
  )
})
