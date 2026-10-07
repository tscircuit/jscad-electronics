import { expect, test } from "bun:test"
import { createLinearBallBearingMesh } from "../lib/models/linearballbearing"

test("linearballbearing rejects unsupported tessellation and unrenderable/invalid dimensions", () => {
  for (const segments of [0, 24, 48, 95, 97, 193, Infinity, NaN, 96.5])
    expect(() => createLinearBallBearingMesh({}, { segments })).toThrow()
  expect(() =>
    createLinearBallBearingMesh({ boreDiameter: 0 } as never),
  ).toThrow()
  expect(() =>
    createLinearBallBearingMesh({ width: "2mmjunk" } as never),
  ).toThrow()
  expect(() => createLinearBallBearingMesh({ typo: true } as never)).toThrow()
  expect(() =>
    createLinearBallBearingMesh({
      boreDiameter: 8,
      outerDiameter: 8.000000001,
      length: 24,
    }),
  ).toThrow("numerical resolution")
})
