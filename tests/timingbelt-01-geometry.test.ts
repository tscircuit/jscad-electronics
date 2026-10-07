import { expect, test } from "bun:test"
import { getTimingBeltDimensions } from "@tscircuit/modelprinter"
import { createTimingBeltMesh } from "../lib/models/timingbelt"
import {
  assertClosedGearMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
test("timingbelt actual trapezoids, integer pitch, cut ends, width and tensile datum", () => {
  for (const toothCount of [1, 7, 20, 64, 1024]) {
    const d = getTimingBeltDimensions({ toothCount }),
      width = 10
    const mesh = createTimingBeltMesh({ toothCount, width })
    const volume = assertClosedGearMesh(mesh)
    const ideal =
      width *
      (d.length * d.backingThickness +
        (toothCount * d.toothHeight * (d.toothBaseWidth + d.toothTipWidth)) / 2)
    expect(volume).toBeCloseTo(ideal, 7)
    expect(meshBounds(mesh).minimum).toEqual([0, -5, d.toothTipZ])
    expect(meshBounds(mesh).maximum).toEqual([d.length, 5, d.backZ])
    const tips: number[] = []
    for (let i = 0; i < mesh.positions.length; i += 3)
      if (mesh.positions[i + 1] === -5 && mesh.positions[i + 2] === d.toothTipZ)
        tips.push(mesh.positions[i]!)
    expect(tips).toHaveLength(toothCount * 2)
    for (let n = 0; n < toothCount; n++) {
      const center = (tips[n * 2]! + tips[n * 2 + 1]!) / 2
      expect(center).toBeCloseTo((n + 0.5) * d.pitch, 10)
      expect(tips[n * 2 + 1]! - tips[n * 2]!).toBeCloseTo(d.toothTipWidth, 10)
    }
    const count = mesh.positions.length / 6
    const rootVertices: number[] = []
    for (let i = 0; i < count; i++)
      if (mesh.positions[i * 3 + 2] === d.toothRootZ)
        rootVertices.push(mesh.positions[i * 3]!)
    expect(rootVertices[1]).toBe(d.endMargin)
    expect(rootVertices.at(-2)).toBeCloseTo(d.length - d.endMargin, 12)
    expect(d.toothHeight).toBe(1.2)
    expect(d.toothBaseWidth - d.toothTipWidth).toBeCloseTo(
      2 * d.toothHeight * Math.tan((d.toothAngle * Math.PI) / 360),
      12,
    )
  }
  expect(() => createTimingBeltMesh({ width: 1e-9 })).toThrow("resolution")
  expect(() => createTimingBeltMesh({ width: 1e9 })).toThrow("resolution")
  expect(() => createTimingBeltMesh({ toothCount: 0 })).toThrow()
})
