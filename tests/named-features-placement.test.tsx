import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { references } from "@tscircuit/jscad"
import { Custom, Rotate, Translate } from "jscad-fiber/headless"
import { renderToJscadModel } from "jscad-fiber/model"
import {
  listJscadNamedEdges,
  listJscadReferenceFeatures,
  readJscadNamedEdge,
  readJscadReferenceFeature,
} from "../lib/named-edges"

test("kernel-authored native path references follow Fiber placement", () => {
  const path = jscad.geometries.path2.fromPoints({ closed: false }, [
    [0, 0],
    [2, 3],
    [4, 1],
  ])
  const solid = jscad.primitives.cuboid({ size: [4, 6, 2] })
  const datum = references.reference("bent_path", path)
  const before = JSON.stringify({ path, solid })
  function Part() {
    return (
      <Translate offset={[10, 20, 30]}>
        <Rotate angles={[Math.PI / 2, 0, Math.PI / 2]}>
          <Custom geometry={solid} />
          <Custom geometry={datum} />
        </Rotate>
      </Translate>
    )
  }
  const model = renderToJscadModel(<Part />, jscad)
  expect(model.geometries).toHaveLength(1)
  expect(listJscadReferenceFeatures(model)).toEqual(["bent_path"])
  expect(listJscadNamedEdges(model)).toEqual(["bent_path"])
  const edge = readJscadNamedEdge(model, "bent_path")
  expect(edge.closed).toBe(false)
  const expected = [
    [10, 20, 30],
    [10, 22, 33],
    [10, 24, 31],
  ]
  edge.points.forEach((point, i) => {
    for (const [axis, value] of [point.x, point.y, point.z].entries())
      expect(value).toBeCloseTo(expected[i]![axis]!, 8)
  })
  const feature = readJscadReferenceFeature(model, "bent_path")
  expect(jscad.geometries.path2.isA(feature.geometry)).toBe(true)
  expect(feature.matrix.slice(12, 15)).toEqual([10, 20, 30])
  expect(JSON.stringify({ path, solid })).toBe(before)
})
