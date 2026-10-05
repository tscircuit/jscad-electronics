import { expect, test } from "bun:test"
import { createHexNutMesh } from "../lib/HexNut"

test("hexnut rejects invalid tessellation options before allocation", () => {
  for (const options of [
    { radialSegments: 25 },
    { radialSegments: 10000 },
    { radialSegments: NaN },
    { segmentsPerPitch: 0 },
    { segmentsPerPitch: 1000 },
  ])
    expect(() =>
      createHexNutMesh({ metricSize: "M6" as const }, options),
    ).toThrow(/resolution limit/i)
})
