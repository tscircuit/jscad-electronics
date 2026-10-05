import { expect, test } from "bun:test"
import { createThreadedRodMesh } from "../lib/ThreadedRod"

test("threaded rod allocation guards reject excessive turns and vanishing radii", () => {
  expect(() =>
    createThreadedRodMesh({ metricSize: "M6", length: 1e12 }),
  ).toThrow(/resolution limit/i)
  expect(() =>
    createThreadedRodMesh({
      metricSize: "M6",
      length: 10,
      threadPitch: 1e-100,
    }),
  ).toThrow(/resolution limit/i)
  expect(() =>
    createThreadedRodMesh({ metricSize: "M6", length: 10, chamfer: 3 - 1e-12 }),
  ).toThrow(/resolution limit/i)
})
