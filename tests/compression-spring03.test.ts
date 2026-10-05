import { expect, test } from "bun:test"
import { createCompressionSpringMesh } from "../lib/CompressionSpring"
import { assertClosedGearMesh } from "./fixtures/assert-gear-geometry"
import { base } from "./fixtures/compression-spring-inputs"

test("compression spring resolution limits reject excessive or collapsed allocations", () => {
  expect(() =>
    createCompressionSpringMesh({
      ...base,
      totalTurns: 1000000,
      activeTurns: 999998,
      freeLength: 2000000,
    }),
  ).toThrow(/resolution limit/)
  expect(() =>
    createCompressionSpringMesh({ ...base, freeLength: 8 + 1e-12 }),
  ).toThrow(/resolution limit/)
  expect(() =>
    createCompressionSpringMesh({ ...base, activeTurns: 5 }),
  ).toThrow()
  for (const options of [
    { segmentsPerTurn: 15 },
    { segmentsPerTurn: 257 },
    { wireSegments: 7 },
    { wireSegments: 65 },
    { wireSegments: Infinity },
  ])
    expect(() => createCompressionSpringMesh(base, options)).toThrow()
  assertClosedGearMesh(
    createCompressionSpringMesh(base, { segmentsPerTurn: 16, wireSegments: 8 }),
  )
})
