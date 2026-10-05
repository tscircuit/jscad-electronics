import { expect, test } from "bun:test"
import { createThreadedRodMesh } from "../lib/ThreadedRod"

test("threadedrod rejects invalid tessellation options before allocation", () => {
  for (const options of [
    { radialSegments: 25 },
    { radialSegments: 10000 },
    { radialSegments: NaN },
    { segmentsPerPitch: 0 },
    { segmentsPerPitch: 1000 },
  ])
    expect(() =>
      createThreadedRodMesh({ metricSize: "M6" as const, length: 10 }, options),
    ).toThrow(/resolution limit/i)
})
