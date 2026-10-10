import { test, expect } from "bun:test"
import jscad from "@jscad/modeling"
import { getCableClipDimensions } from "@tscircuit/modelprinter"
import {
  createCableClipGeom,
  createCableClipMesh,
} from "../lib/models/cableclip"
import { props as exampleProps } from "./fixtures/cableclip-case"
test("cableclip has exact fitting bounds, outward closed topology and finite volume", () => {
  for (const props of [
    exampleProps,
    {
      ...exampleProps,
      ...{
        cableDiameter: 8,
        width: 10,
        height: 14,
        thickness: 3,
        arcDegrees: 300,
        tabLength: 8,
        holeDiameter: 2,
      },
    },
  ]) {
    const geom = createCableClipGeom(props)
    const mesh = createCableClipMesh(props)
    jscad.geometries.geom3.validate(geom)
    const actual = jscad.measurements.measureBoundingBox(geom),
      expected = getCableClipDimensions(props).bounds
    for (let corner = 0; corner < 2; corner++)
      for (let axis = 0; axis < 3; axis++)
        expect(actual[corner]![axis]!).toBeCloseTo(expected[corner]![axis]!, 7)
    expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
    expect(mesh.positions.every(Number.isFinite)).toBe(true)
    expect(mesh.indices.length % 3).toBe(0)
    expect(
      mesh.indices.every(
        (index) =>
          Number.isInteger(index) &&
          index >= 0 &&
          index < mesh.positions.length / 3,
      ),
    ).toBe(true)
    const edges = new Map<string, { count: number; balance: number }>()
    let volume = 0
    for (let i = 0; i < mesh.indices.length; i += 3) {
      const [a, b, c] = mesh.indices
        .slice(i, i + 3)
        .map((index) => mesh.positions.slice(index * 3, index * 3 + 3))
      volume +=
        (a![0]! * (b![1]! * c![2]! - b![2]! * c![1]!) +
          a![1]! * (b![2]! * c![0]! - b![0]! * c![2]!) +
          a![2]! * (b![0]! * c![1]! - b![1]! * c![0]!)) /
        6
      for (let j = 0; j < 3; j++) {
        const a = mesh.indices[i + j]!,
          b = mesh.indices[i + ((j + 1) % 3)]!
        const key = [Math.min(a, b), Math.max(a, b)].join(",")
        const old = edges.get(key) ?? { count: 0, balance: 0 }
        edges.set(key, {
          count: old.count + 1,
          balance: old.balance + (a < b ? 1 : -1),
        })
      }
    }
    expect(
      [...edges.values()].every(
        (edge) => edge.count === 2 && edge.balance === 0,
      ),
    ).toBe(true)
    expect(volume).toBeCloseTo(jscad.measurements.measureVolume(geom), 5)
  }
})
