import { expect, test } from "bun:test"
import { measurements } from "@jscad/modeling"
import { mp, getPushFitPlugDimensions } from "@tscircuit/modelprinter"
import {
  createPushFitPlugGeom,
  createPushFitPlugMesh,
} from "../lib/models/pushfitplug/geometry"
const source = "pushfitplug_tubeod6mm_l18mm_headod10mm_headt3mm"
test("pushfitplug dimensions, finite indexed geometry, volume and validation", () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "pushfitplug") throw new Error("Wrong model")
  const { fn, ...p } = definition
  const dims = getPushFitPlugDimensions(p)
  const geom = createPushFitPlugGeom(p)
  const [min, max] = measurements.measureBoundingBox(geom)
  for (let i = 0; i < 3; i++)
    expect(Math.abs(max[i]! - min[i]! - dims.size[i]!)).toBeLessThan(
      dims.size[i]! * 1e-5,
    )
  expect(min[2]).toBeCloseTo(0, 8)
  const nominalVolume = Math.PI * (3 ** 2 * 15 + 5 ** 2 * 3)
  expect(
    Math.abs(measurements.measureVolume(geom) - nominalVolume) / nominalVolume,
  ).toBeLessThan(0.002)
  const mesh = createPushFitPlugMesh(p)
  expect(mesh.indices.length % 3).toBe(0)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  const edges = new Map<string, { count: number; balance: number }>()
  for (let i = 0; i < mesh.indices.length; i += 3)
    for (let j = 0; j < 3; j++) {
      const a = mesh.indices[i + j]!,
        b = mesh.indices[i + ((j + 1) % 3)]!
      const key = [Math.min(a, b), Math.max(a, b)].join(",")
      const prev = edges.get(key) ?? { count: 0, balance: 0 }
      edges.set(key, {
        count: prev.count + 1,
        balance: prev.balance + (a < b ? 1 : -1),
      })
    }
  expect(
    [...edges.values()].every((e) => e.count === 2 && e.balance === 0),
  ).toBe(true)
  expect(() => createPushFitPlugGeom({ ...p, headDiameter: 0 })).toThrow()
})
