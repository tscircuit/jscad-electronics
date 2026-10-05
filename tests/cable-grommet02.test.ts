import { expect, test } from "bun:test"
import { createCableGrommetMesh } from "../lib/CableGrommet"
import { assertClosedGearMesh } from "./fixtures/assert-gear-geometry"
import { base } from "./fixtures/cable-grommet-inputs"

test("grommet renderer rejects invalid contracts and impractical resolution before allocation", () => {
  expect(() =>
    createCableGrommetMesh({ ...base, panelHoleDiameter: 19 }),
  ).toThrow()
  expect(() =>
    createCableGrommetMesh({ ...base, innerDiameter: 20 - 1e-12 }),
  ).toThrow(/resolution limit/)
  for (const radialSegments of [0, 11, 13, 4097, Infinity, 16.5])
    expect(() => createCableGrommetMesh(base, { radialSegments })).toThrow()
  assertClosedGearMesh(createCableGrommetMesh(base, { radialSegments: 12 }))
})
