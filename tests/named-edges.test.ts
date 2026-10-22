import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  createRectangularTubeGeom,
  createRectangularTubeModel,
} from "../lib/models/rectangulartube/geometry"
import {
  listJscadNamedEdges,
  readJscadNamedEdge,
  type NamedJscadModel,
} from "../lib/named-edges"

test("named native features preserve actual straight sides and complete curved profiles", () => {
  const parameters = {
    width: 40,
    height: 20,
    wallThickness: 3,
    length: 80,
    outerRadius: 3,
    innerRadius: 1,
  }
  const model = createRectangularTubeModel(parameters)
  const before = JSON.stringify(model)
  expect(listJscadNamedEdges(model)).toEqual([
    "outer_profile",
    "inner_profile",
    "outer_top",
    "outer_left",
  ])
  const top = readJscadNamedEdge(model, "outer_top")
  expect(top).toEqual({
    points: [
      { x: -17, y: 10, z: 0 },
      { x: 17, y: 10, z: 0 },
    ],
    closed: false,
  })
  expect(readJscadNamedEdge(model, "outer_left")).toEqual({
    points: [
      { x: -20, y: -7, z: 0 },
      { x: -20, y: 7, z: 0 },
    ],
    closed: false,
  })

  const bottomVertices = jscad.geometries.geom3
    .toPolygons(jscad.geometries.geom3.clone(model.geometry))
    .flatMap((polygon) => polygon.vertices)
    .filter((point) => Math.abs(point[2]!) < 1e-8)
  for (const name of listJscadNamedEdges(model)) {
    const feature = readJscadNamedEdge(model, name)
    for (const point of feature.points)
      expect(
        bottomVertices.some(
          (vertex) =>
            // JSCAD's 2D boolean snaps the extrusion input to its epsilon.
            Math.hypot(vertex[0]! - point.x, vertex[1]! - point.y) < 0.0003,
        ),
      ).toBe(true)
  }
  const outline = readJscadNamedEdge(model, "outer_profile")
  expect(outline.closed).toBe(true)
  expect(outline.points.length).toBeGreaterThan(4)
  expect(Math.max(...outline.points.map((p) => p.x))).toBe(20)
  expect(Math.min(...outline.points.map((p) => p.x))).toBe(-20)
  expect(outline.points.some((p) => p.x > 17 && p.y > 7)).toBe(true)
  expect(readJscadNamedEdge(model, "inner_profile").closed).toBe(true)
  expect(JSON.stringify(model)).toBe(before)
  expect(model.geometry).toEqual(createRectangularTubeGeom(parameters))

  const sharp = createRectangularTubeModel({
    ...parameters,
    width: 50,
    outerRadius: 0,
    innerRadius: 0,
  })
  expect(readJscadNamedEdge(sharp, "outer_top").points).toEqual([
    { x: -25, y: 10, z: 0 },
    { x: 25, y: 10, z: 0 },
  ])
  expect(readJscadNamedEdge(sharp, "outer_profile").points).toHaveLength(4)
  expect(() => readJscadNamedEdge(model, "overall_width")).toThrow(
    'does not define named edge "overall_width"',
  )
  expect(() => readJscadNamedEdge(model, "toString")).toThrow()

  // Feature discovery must not drop tiny real sides or prevent valid geometry
  // construction when the other axis is much larger.
  const extreme = createRectangularTubeModel({
    width: 100000,
    height: 20,
    wallThickness: 2,
    length: 80,
    outerRadius: 9.9999,
    innerRadius: 4,
  })
  const tinyLeft = readJscadNamedEdge(extreme, "outer_left").points
  expect(tinyLeft[1]!.y - tinyLeft[0]!.y).toBeCloseTo(0.0002, 8)

  const nativePath = jscad.geometries.path2.fromPoints({ closed: false }, [
    [0, 0],
    [2, 3],
    [4, 1],
  ])
  const pathModel: NamedJscadModel = {
    geometry: model.geometry,
    namedEdges: { bent: jscad.transforms.translate([5, 7], nativePath) },
  }
  const pathBefore = JSON.stringify(pathModel)
  expect(readJscadNamedEdge(pathModel, "bent")).toEqual({
    points: [
      { x: 5, y: 7, z: 0 },
      { x: 7, y: 10, z: 0 },
      { x: 9, y: 8, z: 0 },
    ],
    closed: false,
  })
  expect(JSON.stringify(pathModel)).toBe(pathBefore)
  const multipleContours: NamedJscadModel = {
    geometry: model.geometry,
    namedEdges: {
      ambiguous: jscad.booleans.subtract(
        jscad.primitives.rectangle({ size: [10, 10] }),
        jscad.primitives.rectangle({ size: [5, 5] }),
      ),
    },
  }
  expect(() => readJscadNamedEdge(multipleContours, "ambiguous")).toThrow(
    "name its boundaries separately",
  )
})
