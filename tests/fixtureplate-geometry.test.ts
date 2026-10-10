import { expect, test } from "bun:test"
import { measurements } from "@jscad/modeling"
import { mp, getFixturePlateDimensions } from "@tscircuit/modelprinter"
import {
  createFixturePlateGeom,
  createFixturePlateMesh,
} from "../lib/models/fixtureplate/geometry"
const source =
  "fixtureplate_l80mm_w60mm_t8mm_hole6mm_cols3_rows2_pitch25mm_edgex15mm_edgey15mm"
test("fixtureplate dimensions, finite indexed geometry, volume and validation", () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "fixtureplate") throw new Error("Wrong model")
  const { fn, ...p } = definition
  const dims = getFixturePlateDimensions(p)
  const geom = createFixturePlateGeom(p)
  const [min, max] = measurements.measureBoundingBox(geom)
  for (let i = 0; i < 3; i++)
    expect(Math.abs(max[i]! - min[i]! - dims.size[i]!)).toBeLessThan(
      dims.size[i]! * 1e-5,
    )
  expect(min[2]).toBeCloseTo(0, 8)
  const nominalVolume = (80 * 60 - 6 * Math.PI * 3 ** 2) * 8
  expect(
    Math.abs(measurements.measureVolume(geom) - nominalVolume) / nominalVolume,
  ).toBeLessThan(0.001)
  const mesh = createFixturePlateMesh(p)
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
  expect(() => createFixturePlateGeom({ ...p, length: 0 })).toThrow()
})
