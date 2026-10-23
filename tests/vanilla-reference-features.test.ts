import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { Fragment, h } from "../lib/vanilla/h"
import {
  Colorize,
  Custom,
  ExtrudeLinear,
  Rotate,
  Translate,
  Union,
  renderToJscadModel,
} from "../lib/vanilla/primitives"
import { render } from "../lib/vanilla/render"

test("vanilla named native features follow 3D ancestors and remain outside CSG", () => {
  const path = jscad.transforms.translate(
    [3, 4],
    jscad.geometries.path2.fromPoints({ closed: false }, [
      [0, 0],
      [2, 0],
      [2, 2],
    ]),
  )
  const solid = jscad.primitives.cuboid({ size: [2, 4, 6] })
  const profile = jscad.primitives.rectangle({ size: [6, 4] })
  const before = JSON.stringify({ path, profile })
  const local = h(
    Union,
    {},
    h(Custom, { name: "body", geometry: solid }),
    h(Custom, { name: "bent_edge", geometry: path, reference: true }),
    h(Custom, { name: "cut_profile", geometry: profile, reference: true }),
  )
  const node = h(
    Translate,
    { offset: [10, 20, 30] },
    h(
      Rotate,
      { angles: [Math.PI / 2, 0, 0] },
      h(Translate, { offset: [0, 2, 3] }, local),
    ),
  )
  const result = renderToJscadModel(node, jscad)
  expect(Object.keys(result.referenceFeatures)).toEqual([
    "body",
    "bent_edge",
    "cut_profile",
  ])
  expect(result.geometries).toHaveLength(1)
  expect(result.geometries[0]).toEqual(render(node, jscad).geometries[0]!.geom)
  expect(jscad.measurements.measureVolume(result.geometries[0]!)).toBeCloseTo(
    48,
  )
  const feature = result.referenceFeatures.bent_edge!
  expect(feature.geometry).toBe(path)
  const localPoints = jscad.geometries.path2.toPoints(
    jscad.geometries.path2.clone(path),
  )
  const points = localPoints.map(([x, y]) =>
    jscad.maths.vec3.transform(
      jscad.maths.vec3.create(),
      [x!, y!, 0],
      feature.matrix as jscad.maths.mat4.Mat4,
    ),
  )
  for (const [index, expected] of [
    [13, 17, 36],
    [15, 17, 36],
    [15, 17, 38],
  ].entries())
    expected.forEach((value, axis) =>
      expect(points[index]![axis]).toBeCloseTo(value, 10),
    )
  expect(JSON.stringify({ path, profile })).toBe(before)
  const colored = renderToJscadModel(
    h(Colorize, { color: "#369" }, local),
    jscad,
  )
  expect(colored.geometries[0]!.color).toEqual([0.2, 0.4, 0.6, 1])
  expect(colored.referenceFeatures.body!.geometry.color).toBeUndefined()
  expect(colored.referenceFeatures.bent_edge!.geometry.color).toBeUndefined()
  const featureOnly = renderToJscadModel(
    h(Custom, {
      name: "  authored name  ",
      geometry: profile,
      reference: true,
    }),
    jscad,
  )
  expect(featureOnly.geometries).toHaveLength(0)
  expect(Object.keys(featureOnly.referenceFeatures)).toEqual([
    "  authored name  ",
  ])
  expect(() =>
    renderToJscadModel(
      h(Fragment, {}, local, h(Custom, { name: "body", geometry: solid })),
      jscad,
    ),
  ).toThrow("Duplicate")
  for (const props of [
    { name: " ", geometry: profile },
    { reference: true, geometry: profile },
  ])
    expect(() => renderToJscadModel(h(Custom, props), jscad)).toThrow(
      "nonblank",
    )
  const declaration = h(Custom, {
    name: "reference_only",
    geometry: profile,
    reference: true,
  })
  const referenceExtrusion = renderToJscadModel(
    h(ExtrudeLinear, { height: 4 }, declaration),
    jscad,
  )
  expect(referenceExtrusion.geometries).toHaveLength(0)
  expect(referenceExtrusion.referenceFeatures.reference_only!.geometry).toBe(
    profile,
  )
  for (const invalid of [
    h(Translate, { offset: [Infinity, 0, 0] }, declaration),
    h(Translate, { offset: [NaN, 0, 0] }, declaration),
    h(Rotate, { angles: [NaN, 0, 0] }, declaration),
    h(
      Translate,
      { offset: [1e308, 0, 0] },
      h(Translate, { offset: [1e308, 0, 0] }, declaration),
    ),
  ])
    expect(() => renderToJscadModel(invalid, jscad)).toThrow("finite")
  // Existing geometry rendering retains its historical coordinate coercion.
  expect(() =>
    render(
      h(Translate, { offset: [NaN, 0, 0] }, h(Custom, { geometry: solid })),
      jscad,
    ),
  ).not.toThrow()
})
