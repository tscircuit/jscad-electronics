import { test, expect } from "bun:test"
import jscad from "@jscad/modeling"
import { getPcbEdgeSupportDimensions } from "@tscircuit/modelprinter"
import {
  createPcbEdgeSupportGeom,
  createPcbEdgeSupportMesh,
} from "../lib/models/pcbedgesupport"
import { props } from "./fixtures/pcbedgesupport-case"
test("pcbedgesupport keeps its cable/board opening empty and fitting walls solid", () => {
  const geom = createPcbEdgeSupportGeom(props)
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
    [0, 0, 12],
    [7, 0, 1],
    [7, 0, 5],
  ])
    expect(occupied(point)).toBe(false)
  for (const point of [
    [0, 3, 12],
    [9, 0, 1],
    [0, 0, 8],
  ])
    expect(occupied(point)).toBe(true)
  expect(() => createPcbEdgeSupportGeom({ ...props, width: 0 })).toThrow()
})
