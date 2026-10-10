import { test, expect } from "bun:test"
import jscad from "@jscad/modeling"
import { getFlatCableClipDimensions } from "@tscircuit/modelprinter"
import {
  createFlatCableClipGeom,
  createFlatCableClipMesh,
} from "../lib/models/flatcableclip"
import { props } from "./fixtures/flatcableclip-case"
test("flatcableclip keeps its cable/board opening empty and fitting walls solid", () => {
  const geom = createFlatCableClipGeom(props)
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
    [0, 0, 1.5],
    [17, 0, 1],
  ])
    expect(occupied(point)).toBe(false)
  for (const point of [
    [13.5, 0, 2.5],
    [0, 0, 4],
    [18.8, 0, 1],
  ])
    expect(occupied(point)).toBe(true)
  expect(() => createFlatCableClipGeom({ ...props, innerWidth: 0 })).toThrow()
})
