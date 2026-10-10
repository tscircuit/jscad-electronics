import { test, expect } from "bun:test"
import jscad from "@jscad/modeling"
import { getEdgeGrommetDimensions } from "@tscircuit/modelprinter"
import {
  createEdgeGrommetGeom,
  createEdgeGrommetMesh,
} from "../lib/models/edgegrommet"
import { props } from "./fixtures/edgegrommet-case"
test("edgegrommet keeps its cable/board opening empty and fitting walls solid", () => {
  const geom = createEdgeGrommetGeom(props)
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
    [0, 0, 1],
    [0, 2.4, 5.9],
  ])
    expect(occupied(point)).toBe(false)
  for (const point of [
    [0, 0, 5],
    [0, 2, 3],
  ])
    expect(occupied(point)).toBe(true)
  expect(() => createEdgeGrommetGeom({ ...props, length: 0 })).toThrow()
})
