import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { Fragment, h } from "../lib/vanilla/h"
import {
  Custom,
  ExtrudeLinear,
  Polygon,
  Rotate,
  Subtract,
  Translate,
  Union,
  renderToJscadModel,
} from "../lib/vanilla/primitives"
import { render } from "../lib/vanilla/render"

test("vanilla extrusion outlines retain holed profiles, signed height, twist and placement", () => {
  const outer = [
    [-3, -2],
    [3, -2],
    [3, 2],
    [-3, 2],
  ]
  const inner = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ]
  const profile = h(
    Subtract,
    {},
    h(Polygon, { points: outer }),
    h(Polygon, { points: inner }),
  )
  for (const [height, twistAngle] of [
    [5, Math.PI / 2],
    [-5, -Math.PI / 2],
  ]) {
    const extrusion = h(
      ExtrudeLinear,
      {
        height,
        twistAngle,
        twistSteps: 4,
        topOutlineName: "top",
        bottomOutlineName: "bottom",
      },
      profile,
    )
    const node = h(
      Translate,
      { offset: [10, 20, 30] },
      h(Rotate, { angles: [Math.PI / 2, 0, 0] }, extrusion),
    )
    const model = renderToJscadModel(node, jscad)
    expect(Object.keys(model.referenceFeatures)).toEqual(["top", "bottom"])
    expect(model.geometries).toHaveLength(1)
    expect(
      jscad.measurements.measureVolume(model.geometries[0]!),
    ).toBeGreaterThan(0)
    const solidVertices = jscad.geometries.geom3
      .toPolygons(
        jscad.geometries.geom3.clone(
          model.geometries[0] as jscad.geometries.geom3.Geom3,
        ),
      )
      .flatMap((polygon) => polygon.vertices)
    for (const name of ["top", "bottom"]) {
      const feature = model.referenceFeatures[name]!
      const outlines = jscad.geometries.geom2.toOutlines(
        jscad.geometries.geom2.clone(
          feature.geometry as jscad.geometries.geom2.Geom2,
        ),
      )
      expect(outlines).toHaveLength(2)
      const matrix = feature.matrix as jscad.maths.mat4.Mat4
      const origin = jscad.maths.vec3.transform(
        jscad.maths.vec3.create(),
        [0, 0, 0],
        matrix,
      )
      expect(origin[0]).toBeCloseTo(10, 8)
      expect(origin[1]).toBeCloseTo(name === "top" ? 20 - height! : 20, 8)
      expect(origin[2]).toBeCloseTo(30, 8)
      for (const [x, y] of outlines.flat()) {
        const point = jscad.maths.vec3.transform(
          jscad.maths.vec3.create(),
          [x!, y!, 0],
          matrix,
        )
        expect(
          solidVertices.some(
            (vertex) =>
              Math.hypot(...vertex.map((value, axis) => value - point[axis]!)) <
              1e-6,
          ),
        ).toBe(true)
      }
    }
    const top = model.referenceFeatures.top!
    const transformed = jscad.maths.vec3.transform(
      jscad.maths.vec3.create(),
      [1, 0, 0],
      top.matrix as jscad.maths.mat4.Mat4,
    )
    expect(transformed[0]).toBeCloseTo(10 + Math.cos(twistAngle!), 8)
    expect(transformed[1]).toBeCloseTo(20 - height!, 8)
    expect(transformed[2]).toBeCloseTo(30 + Math.sin(twistAngle!), 8)
  }
  const extrude = (points: number[][]) =>
    h(ExtrudeLinear, { height: 5 }, h(Polygon, { points }))
  const tube = renderToJscadModel(
    h(Subtract, {}, extrude(outer), extrude(inner)),
    jscad,
  ).geometries[0]!
  expect(jscad.measurements.measureVolume(tube)).toBeCloseTo(100, 3)
  const bounds = jscad.measurements.measureBoundingBox(tube)
  expect(bounds[0][2]).toBeCloseTo(0, 8)
  expect(bounds[1][2]).toBeCloseTo(5, 8)
  const expected = jscad.booleans.subtract(
    jscad.extrusions.extrudeLinear(
      { height: 5 },
      jscad.primitives.polygon({ points: outer as [number, number][] }),
    ),
    jscad.extrusions.extrudeLinear(
      { height: 5 },
      jscad.primitives.polygon({ points: inner as [number, number][] }),
    ),
  )
  expect(
    jscad.measurements.measureVolume(tube) /
      jscad.measurements.measureVolume(expected),
  ).toBeCloseTo(1, 8)

  const empty = h(ExtrudeLinear, {
    height: 4,
    topOutlineName: "empty_top",
    bottomOutlineName: "empty_bottom",
  })
  expect(renderToJscadModel(empty, jscad).referenceFeatures).toEqual({})
  expect(renderToJscadModel(empty, jscad).geometries).toHaveLength(0)
  for (const props of [
    { topOutlineName: " " },
    { bottomOutlineName: " " },
    { topOutlineName: "top", height: Infinity },
    { topOutlineName: "top", twistAngle: NaN },
    { topOutlineName: "top", twistSteps: Infinity },
    { topOutlineName: "top", twistSteps: 1.5 },
  ])
    expect(() =>
      renderToJscadModel(h(ExtrudeLinear, { height: 4, ...props }), jscad),
    ).toThrow()
  const duplicate = h(
    ExtrudeLinear,
    { height: 4, topOutlineName: "same", bottomOutlineName: "same" },
    profile,
  )
  expect(() => renderToJscadModel(duplicate, jscad)).toThrow("Duplicate")
  expect(() =>
    renderToJscadModel(
      h(
        Fragment,
        {},
        h(Custom, { name: "top", geometry: jscad.primitives.cuboid() }),
        h(ExtrudeLinear, { height: 4, topOutlineName: "top" }, profile),
      ),
      jscad,
    ),
  ).toThrow("Duplicate")
  const multiple = h(
    ExtrudeLinear,
    { height: 4, topOutlineName: "top" },
    h(Polygon, { points: outer }),
    h(Polygon, { points: inner }),
  )
  expect(() => renderToJscadModel(multiple, jscad)).toThrow("exactly one")
  expect(() => render(multiple, jscad)).toThrow("exactly one")
  const merged = renderToJscadModel(
    h(
      ExtrudeLinear,
      { height: 4, topOutlineName: "merged" },
      h(
        Union,
        {},
        h(Polygon, { points: outer }),
        h(Polygon, { points: inner }),
      ),
    ),
    jscad,
  )
  expect(Object.keys(merged.referenceFeatures)).toEqual(["merged"])
})
