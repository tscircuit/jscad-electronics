import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  createRectangularGasketMesh,
  createRectangularGasketGeom,
} from "../lib/models/rectangulargasket"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  rectangularGasketProps,
  rectangularGasketSource,
} from "./fixtures/rectangulargasket-example"
test("rectangulargasket built vanilla factories and footprint dispatch agree", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createRectangularGasketMesh(rectangularGasketProps)).toEqual(
    createRectangularGasketMesh(rectangularGasketProps),
  )
  const result = vanilla.getJscadModelForFootprintWithPads(
    rectangularGasketSource,
    jscad,
  )
  expect(result.geometries.length).toBe(1)
  expect(
    jscad.measurements.measureVolume(result.geometries[0]!.geom),
  ).toBeCloseTo(
    jscad.measurements.measureVolume(
      createRectangularGasketGeom(rectangularGasketProps),
    ),
    6,
  )
})
