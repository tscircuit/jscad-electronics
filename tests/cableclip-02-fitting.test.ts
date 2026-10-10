import { test, expect } from "bun:test"
import jscad from "@jscad/modeling"
import { getCableClipDimensions } from "@tscircuit/modelprinter"
import {
  createCableClipGeom,
  createCableClipMesh,
} from "../lib/models/cableclip"
import { props } from "./fixtures/cableclip-case"
test("cableclip keeps its cable/board opening empty and fitting walls solid", () => {
  const geom = createCableClipGeom(props)
  const occupied = (point: number[]) =>
    jscad.measurements.measureVolume(
      jscad.booleans.intersect(
        geom,
        jscad.primitives.cuboid({
          size: [0.1, 0.1, 0.1],
          center: point as [number, number, number],
        }),
      ),
    ) > 0.0009
  for (const point of [
    [0, 0, 5],
    [4, 0, 5],
    [10, 0, 1],
  ])
    expect(occupied(point)).toBe(false)
  for (const point of [
    [-4, 0, 5],
    [13, 0, 1],
  ])
    expect(occupied(point)).toBe(true)
  expect(() => createCableClipGeom({ ...props, cableDiameter: 0 })).toThrow()
})
