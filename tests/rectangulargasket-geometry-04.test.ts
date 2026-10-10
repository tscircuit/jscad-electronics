import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getRectangularGasketDimensions } from "@tscircuit/modelprinter"
import { createRectangularGasketGeom } from "../lib/models/rectangulargasket"
import { rectangularGasketProps as p } from "./fixtures/rectangulargasket-example"
test("rectangulargasket volume matches the nominal sealing face area", () => {
  const d = getRectangularGasketDimensions(p),
    volume = jscad.measurements.measureVolume(createRectangularGasketGeom(p))
  expect(Math.abs(volume - d.nominalVolume) / d.nominalVolume).toBeLessThan(
    0.001,
  )
})
