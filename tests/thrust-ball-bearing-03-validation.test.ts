import { expect, test } from "bun:test"
import {
  createThrustBallBearingGeoms,
  createThrustBallBearingMesh,
} from "../lib/models/thrustballbearing"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"

test("thrust renderer validates envelopes and bounds mesh resolution before allocating", () => {
  for (const segments of [0, -24, 20, 25, 194, Infinity, NaN, 1.5])
    expect(() => createThrustBallBearingMesh({}, { segments })).toThrow(
      "multiple of four",
    )
  for (const input of [
    { innerDiameter: 24 },
    { outerDiameter: 10 },
    { height: 0 },
    { height: "9mmjunk" },
    { height: "1e2" },
  ]) {
    expect(() => createThrustBallBearingMesh(input)).toThrow()
    expect(() => createThrustBallBearingGeoms(input)).toThrow()
  }
  for (const footprint of [
    "thrustballbearing_id24",
    "thrustballbearing_h0",
    "thrustballbearing_h9mmjunk",
  ]) {
    expect(() => Footprinter3d({ footprint })).toThrow()
    expect(() => ExtrudedPads({ footprint })).toThrow()
  }
})
