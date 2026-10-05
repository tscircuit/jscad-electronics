import { expect, test } from "bun:test"
import { createFlangedBushingMesh } from "../lib/models/flangedbushing"
import { examples } from "./fixtures/flanged-bushing-cases"
import {
  innerRadiusAtAngle,
  sliceMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"

test("flanged bushing datum and square shoulder preserve overall length including flange", () => {
  const mesh = createFlangedBushingMesh(examples[0]!)
  expect(meshBounds(mesh).maximum[2]).toBe(15)
  expect(new Set(mesh.positions.filter((_, i) => i % 3 === 2))).toEqual(
    new Set([0, 2, 15]),
  )
  for (const [z, expected] of [
    [0, [4, 9]],
    [2, [6, 9]],
    [15, [4, 6]],
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
  // No separate solid, inner shoulder or cap can obstruct the shared through bore.
  expect(innerRadiusAtAngle(sliceMesh(mesh, 1.999), 0)).toBe(4)
  expect(innerRadiusAtAngle(sliceMesh(mesh, 2.001), 0)).toBe(4)
})
