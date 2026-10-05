import { expect, test } from "bun:test"
import { createPlainBushingMesh } from "../lib/models/plainbushing"
import { examples } from "./fixtures/plain-bushing-cases"

test("plain bushing chamfers every bore and outside rim without changing overall length", () => {
  const mesh = createPlainBushingMesh(examples[0]!)
  for (const [z, expected] of [
    [0, [4.5, 5.5]],
    [0.5, [4, 6]],
    [19.5, [4, 6]],
    [20, [4.5, 5.5]],
  ] as const) {
    const radii = new Set<number>()
    for (let i = 0; i < mesh.positions.length; i += 3)
      if (mesh.positions[i + 2] === z)
        radii.add(
          Number(
            Math.hypot(mesh.positions[i]!, mesh.positions[i + 1]!).toFixed(8),
          ),
        )
    expect([...radii].sort((a, b) => a - b)).toEqual([...expected])
  }
  const square = createPlainBushingMesh({
    innerDiameter: 8,
    outerDiameter: 12,
    length: 20,
  })
  expect(new Set(square.positions.filter((_, i) => i % 3 === 2))).toEqual(
    new Set([0, 20]),
  )
  expect(square.indices.length).toBeLessThan(mesh.indices.length)
})
