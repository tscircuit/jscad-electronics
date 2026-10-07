import { expect, test } from "bun:test"
import { mp, getFinnedHeatsinkDimensions } from "@tscircuit/modelprinter"
import { createFinnedHeatsinkMesh } from "../lib/models/finnedheatsink"
import {
  assertClosedGearMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { standardString, compactString } from "./fixtures/finnedheatsink-inputs"
for (const source of [
  standardString,
  compactString,
  "finnedheatsink_fins2",
  "finnedheatsink_w128mm_fin0.5mm_fins128",
]) {
  test(`finned heatsink closed topology, exact envelope and solid volume: ${source}`, () => {
    const d = mp.string(source).json()
    if (d.fn !== "finnedheatsink") throw new Error("Expected heatsink")
    const { fn, ...p } = d,
      mesh = createFinnedHeatsinkMesh(p)
    const volume = assertClosedGearMesh(mesh),
      bounds = meshBounds(mesh)
    expect(bounds.minimum).toEqual([-p.width / 2, -p.length / 2, 0])
    expect(bounds.maximum).toEqual([p.width / 2, p.length / 2, p.height])
    expect(volume).toBeCloseTo(getFinnedHeatsinkDimensions(p).volume, 7)
    // The comb outline has four corners per fin; no floating solids or seam walls.
    expect(mesh.positions.length / 3).toBe(p.finCount * 8)
  })
}
test("finned heatsink slots are open to the base and spaced by the contract", () => {
  const p = {
    width: 20,
    length: 25,
    height: 12,
    baseThickness: 2,
    finThickness: 1,
    finCount: 6,
  }
  const mesh = createFinnedHeatsinkMesh(p)
  const at = (i: number) => mesh.positions.slice(3 * i, 3 * i + 3)
  const tops: number[] = []
  for (let i = 0; i < mesh.positions.length / 3; i++) {
    const [x, y, z] = at(i)
    if (y === -12.5 && z === 12) tops.push(x!)
  }
  tops.sort((a, b) => a - b)
  expect(tops).toHaveLength(12)
  for (let i = 0; i < 6; i++) {
    expect(tops[2 * i]).toBeCloseTo(-10 + i * 3.8, 10)
    expect(tops[2 * i + 1]! - tops[2 * i]!).toBeCloseTo(1, 10)
  }
})
test("finned heatsink rejects numerically unresolved walls", () => {
  for (const p of [
    { finThickness: 1e-15 },
    { baseThickness: 1e-15 },
    { length: 1e-15 },
  ])
    expect(() => createFinnedHeatsinkMesh(p)).toThrow("resolution")
})
