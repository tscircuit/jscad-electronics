import { test, expect } from "bun:test"
import jscad from "@jscad/modeling"
import { getCableCombDimensions } from "@tscircuit/modelprinter"
import {
  createCableCombGeom,
  createCableCombMesh,
} from "../lib/models/cablecomb"
import { props } from "./fixtures/cablecomb-case"
test("cablecomb keeps its cable/board opening empty and fitting walls solid", () => {
  const geom = createCableCombGeom(props)
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
    [4, 0, 8],
    [26, 0, 5],
  ])
    expect(occupied(point)).toBe(false)
  for (const point of [
    [0, 0, 8],
    [4, 0, 1],
    [29, 0, 5],
  ])
    expect(occupied(point)).toBe(true)
  expect(() => createCableCombGeom({ ...props, width: 0 })).toThrow()
})
