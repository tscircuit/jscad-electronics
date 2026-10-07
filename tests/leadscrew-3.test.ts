import { expect, test } from "bun:test"
import { createLeadScrewMesh } from "../lib/models/leadscrew"
test("screw mesh guards bound allocation and validate dimensions before geometry", () => {
  for (const options of [
    { radialSegments: 31 },
    { radialSegments: 40 },
    { radialSegments: 208 },
    { segmentsPerPitch: 7 },
    { segmentsPerPitch: 65 },
    { segmentsPerPitch: Infinity },
  ])
    expect(() =>
      createLeadScrewMesh({ threadSize: "TR8x8(P2)", length: 10 }, options),
    ).toThrow("resolution")
  expect(() =>
    createLeadScrewMesh({ threadSize: "TR8x2", length: 1e8 }),
  ).toThrow("resolution")
  expect(() =>
    createLeadScrewMesh({ threadSize: "TR8x2", length: 10, threadLead: 8 }),
  ).toThrow()
})
