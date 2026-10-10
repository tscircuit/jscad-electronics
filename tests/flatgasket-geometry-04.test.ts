import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getFlatGasketDimensions } from "@tscircuit/modelprinter"
import { createFlatGasketGeom } from "../lib/models/flatgasket"
import { flatGasketProps as p } from "./fixtures/flatgasket-example"
test("flatgasket volume matches the nominal sealing face area", () => {
  const d = getFlatGasketDimensions(p),
    volume = jscad.measurements.measureVolume(createFlatGasketGeom(p))
  expect(Math.abs(volume - d.nominalVolume) / d.nominalVolume).toBeLessThan(
    0.001,
  )
})
