import { expect, test } from "bun:test"
import { measurements } from "@jscad/modeling"
import { mp, getVBlockDimensions } from "@tscircuit/modelprinter"
import {
  createVBlockGeom,
  createVBlockMesh,
} from "../lib/models/vblock/geometry"
const source =
  "vblock_l60mm_w40mm_h40mm_vangle90deg_vdepth10mm_mountgroovew3mm_mountgrooved3mm_mountz10mm"
test("vblock dimensions, finite indexed geometry, volume and validation", () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "vblock") throw new Error("Wrong model")
  const { fn, ...p } = definition
  const dims = getVBlockDimensions(p)
  const geom = createVBlockGeom(p)
  const [min, max] = measurements.measureBoundingBox(geom)
  for (let i = 0; i < 3; i++)
    expect(Math.abs(max[i]! - min[i]! - dims.size[i]!)).toBeLessThan(
      dims.size[i]! * 1e-5,
    )
  expect(min[2]).toBeCloseTo(0, 8)
  const nominalVolume = (40 * 40 - 100 - 18) * 60
  expect(
    Math.abs(measurements.measureVolume(geom) - nominalVolume) / nominalVolume,
  ).toBeLessThan(0.001)
  const mesh = createVBlockMesh(p)
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
  expect(() => createVBlockGeom({ ...p, length: 0 })).toThrow()
})
