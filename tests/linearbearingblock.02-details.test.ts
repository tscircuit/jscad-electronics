import { expect, test } from "bun:test"
import { getLinearBearingBlockDimensions } from "@tscircuit/modelprinter"
import { createLinearBearingBlockMesh } from "../lib/models/linearbearingblock"
import { assertAssembly, rayHits } from "./fixtures/linearbearingblock-geometry"
import { meshBounds } from "./fixtures/assert-gear-geometry"

test("block custom units preserve housing datum and cartridge axial end planes", () => {
  const input = {
    width: "4cm",
    length: "3cm",
    height: "3cm",
    mountPitchX: 28,
    mountPitchY: 20,
  }
  const d = getLinearBearingBlockDimensions(input),
    mesh = createLinearBearingBlockMesh(input)
  assertAssembly(mesh.parts)
  expect(meshBounds(mesh).minimum).toEqual([-20, -15, 0])
  expect(meshBounds(mesh).maximum).toEqual([20, 15, 30])
  for (const part of mesh.parts.filter((part) =>
    part.name.startsWith("end retainer"),
  )) {
    const bounds = meshBounds(part.mesh)
    expect(bounds.minimum[2]).toBeGreaterThan(d.shaftHeight - d.cartridgeRadius)
    expect(bounds.maximum[2]).toBeLessThan(d.shaftHeight + d.cartridgeRadius)
  }
  expect(rayHits(mesh, [0, -16, d.shaftHeight], [0, 1, 0])).toBe(false)
  expect(
    createLinearBearingBlockMesh({}, { segments: 192 }).positions.length,
  ).toBeGreaterThan(createLinearBearingBlockMesh().positions.length)
})
