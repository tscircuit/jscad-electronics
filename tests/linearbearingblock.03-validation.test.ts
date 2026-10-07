import { expect, test } from "bun:test"
import { createLinearBearingBlockMesh } from "../lib/models/linearbearingblock"

test("linearbearingblock rejects unsupported tessellation and unrenderable/invalid dimensions", () => {
  for (const segments of [0, 24, 48, 95, 97, 193, Infinity, NaN, 96.5])
    expect(() => createLinearBearingBlockMesh({}, { segments })).toThrow()
  expect(() =>
    createLinearBearingBlockMesh({ boreDiameter: 0 } as never),
  ).toThrow()
  expect(() =>
    createLinearBearingBlockMesh({ width: "2mmjunk" } as never),
  ).toThrow()
  expect(() => createLinearBearingBlockMesh({ typo: true } as never)).toThrow()
  expect(() =>
    createLinearBearingBlockMesh({
      boreDiameter: 8,
      bearingOuterDiameter: 8.000000001,
    }),
  ).toThrow("numerical resolution")
})
