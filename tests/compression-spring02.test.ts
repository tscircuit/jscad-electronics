import { expect, test } from "bun:test"
import { getCompressionSpringCenterlinePoint } from "@tscircuit/modelprinter"
import { createCompressionSpringMesh } from "../lib/models/compressionspring"
import { base } from "./fixtures/compression-spring-inputs"

test("compression spring mesh follows imported pitch changes and radial section frames", () => {
  const mesh = createCompressionSpringMesh(base)
  for (const turn of [0.25, 0.75, 1, 1.25, 3.5, 7, 7.25, 7.75]) {
    const center = getCompressionSpringCenterlinePoint(base, turn)
    const radius = Math.hypot(center.x, center.y)
    const radialX = center.x / radius
    const radialY = center.y / radius
    for (const [radialOffset, zOffset] of [
      [0.5, 0],
      [-0.5, 0],
      [0, 0.5],
      [0, -0.5],
    ]) {
      if (center.z + zOffset! < 0 || center.z + zOffset! > base.freeLength)
        continue
      const point = [
        center.x + radialOffset! * radialX,
        center.y + radialOffset! * radialY,
        center.z + zOffset!,
      ]
      let distance = Infinity
      for (let index = 0; index < mesh.positions.length; index += 3)
        distance = Math.min(
          distance,
          Math.hypot(
            ...point.map(
              (value, axis) => value - mesh.positions[index + axis]!,
            ),
          ),
        )
      expect(distance).toBeLessThan(1e-10)
    }
  }
  const left = createCompressionSpringMesh({ ...base, hand: "left" })
  const key = (x: number, y: number, z: number) =>
    [x, y, z].map((n) => Math.round(n * 1e8)).join(",")
  const reflected = new Set<string>()
  for (let index = 0; index < left.positions.length; index += 3)
    reflected.add(
      key(
        left.positions[index]!,
        -left.positions[index + 1]!,
        left.positions[index + 2]!,
      ),
    )
  for (let index = 0; index < mesh.positions.length; index += 3)
    expect(
      reflected.has(
        key(
          mesh.positions[index]!,
          mesh.positions[index + 1]!,
          mesh.positions[index + 2]!,
        ),
      ),
    ).toBe(true)
})
