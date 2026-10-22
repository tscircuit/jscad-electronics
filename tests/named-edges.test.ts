import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { createRectangularTubeGeom } from "../lib/models/rectangulartube/geometry"
import { createRectangularTubeModel } from "../lib/models/rectangulartube/model"
import { listJscadNamedEdges, readJscadNamedEdge } from "../lib/named-edges"

test("extrusion outline names identify complete outer and bore contours at their actual ends", () => {
  const parameters = {
    width: 40,
    height: 20,
    wallThickness: 3,
    length: 80,
    outerRadius: 3,
    innerRadius: 1,
  }
  const model = createRectangularTubeModel(parameters)
  const geometry = model.geometries[0]!
  if (!jscad.geometries.geom3.isA(geometry)) throw new Error("Expected solid")
  const before = JSON.stringify(model)
  expect(listJscadNamedEdges(model)).toEqual([
    "outer_top",
    "outer_bottom",
    "inner_top",
    "inner_bottom",
  ])
  const vertices = jscad.geometries.geom3
    .toPolygons(jscad.geometries.geom3.clone(geometry))
    .flatMap((polygon) => polygon.vertices)
  for (const name of listJscadNamedEdges(model)) {
    const contour = readJscadNamedEdge(model, name)
    expect(contour.closed).toBe(true)
    expect(contour.points.length).toBeGreaterThan(4)
    expect(
      contour.points.every(
        (point) => point.z === (name.endsWith("_top") ? 80 : 0),
      ),
    ).toBe(true)
    const xs = contour.points.map((point) => point.x)
    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(
      name.startsWith("outer") ? 40 : 34,
      8,
    )
    for (const point of contour.points)
      expect(
        vertices.some(
          (vertex) =>
            Math.hypot(
              vertex[0]! - point.x,
              vertex[1]! - point.y,
              vertex[2]! - point.z,
            ) < 0.001,
        ),
      ).toBe(true)
  }
  expect(JSON.stringify(model)).toBe(before)
  expect(geometry).toEqual(createRectangularTubeGeom(parameters))
  expect(jscad.measurements.measureVolume(geometry)).toBeGreaterThan(0)
  const sharp = createRectangularTubeModel({
    ...parameters,
    width: 50,
    outerRadius: 0,
    innerRadius: 0,
  })
  const sharpOuter = readJscadNamedEdge(sharp, "outer_top")
  expect(sharpOuter.points).toHaveLength(4)
  expect(Math.max(...sharpOuter.points.map((point) => point.x))).toBe(25)
  expect(Math.min(...sharpOuter.points.map((point) => point.x))).toBe(-25)
  expect(() => readJscadNamedEdge(model, "overall_width")).toThrow(
    'does not define named feature "overall_width"',
  )
  expect(() => readJscadNamedEdge(model, "toString")).toThrow()
  const extreme = createRectangularTubeModel({
    width: 100000,
    height: 20,
    wallThickness: 2,
    length: 80,
    outerRadius: 9.9999,
    innerRadius: 4,
  })
  expect(
    readJscadNamedEdge(extreme, "outer_top").points.length,
  ).toBeGreaterThan(4)
})
