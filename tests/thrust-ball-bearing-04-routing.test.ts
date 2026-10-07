import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  ThrustBallBearing,
  createThrustBallBearingGeoms,
  createThrustBallBearingMesh,
} from "../lib/models/thrustballbearing"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { thrustBallBearingSource } from "./fixtures/thrust-ball-bearing-case"

test("thrust full-string React and vanilla routing preserve all solids and omit pads", async () => {
  const definition = mp.string(thrustBallBearingSource).json()
  if (definition.fn !== "thrustballbearing")
    throw new Error("Expected thrust bearing")
  const { fn, ...props } = definition
  const vanilla = await importVanilla()
  expect(vanilla.createThrustBallBearingMesh(props)).toEqual(
    createThrustBallBearingMesh(props),
  )
  expect(ExtrudedPads({ footprint: thrustBallBearingSource })).toBeNull()
  expect(Footprinter3d({ footprint: thrustBallBearingSource })?.type).toBe(
    ThrustBallBearing,
  )
  const reference = createThrustBallBearingGeoms(props)
  for (const result of [
    getComponentModel(ThrustBallBearing, props),
    getComponentModel(Footprinter3d, { footprint: thrustBallBearingSource }),
    vanilla.getJscadModelForFootprintWithPads(thrustBallBearingSource, jscad),
  ]) {
    expect(result.geometries).toHaveLength(reference.length)
    for (let i = 0; i < reference.length; i++) {
      const solid = result.geometries[i]!.geom as jscad.geometries.geom3.Geom3
      jscad.geometries.geom3.validate(solid)
      expect(jscad.measurements.measureBoundingBox(solid)).toEqual(
        jscad.measurements.measureBoundingBox(reference[i]!),
      )
      expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(
        jscad.measurements.measureVolume(reference[i]!),
        6,
      )
    }
  }
})
