import { expect, test } from "bun:test"
import { createBallBearingMesh } from "../lib/models/ballbearing"

test("ballbearing rejects unsupported tessellation and unrenderable/invalid dimensions", () => {
  for (const segments of [0, 24, 48, 95, 97, 193, Infinity, NaN, 96.5])
    expect(() => createBallBearingMesh({}, { segments })).toThrow()
  expect(() => createBallBearingMesh({ boreDiameter: 0 } as never)).toThrow()
  expect(() => createBallBearingMesh({ width: "2mmjunk" } as never)).toThrow()
  expect(() => createBallBearingMesh({ typo: true } as never)).toThrow()
  expect(() =>
    createBallBearingMesh({
      innerDiameter: 8,
      outerDiameter: 8.000000001,
      width: 7,
    }),
  ).toThrow("numerical resolution")
})
