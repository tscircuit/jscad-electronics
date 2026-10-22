import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { Custom, Rotate, Translate } from "jscad-fiber/headless"
import { renderToJscadModel } from "jscad-fiber/model"
import {
  listJscadNamedEdges,
  listJscadReferenceFeatures,
  readJscadNamedEdge,
  readJscadReferenceFeature,
} from "../lib/named-edges"

test("Fiber feature names cover paths and other native geometry with complete 3D placement", () => {
  const path = jscad.geometries.path2.fromPoints({ closed: false }, [
    [0, 0],
    [2, 3],
    [4, 1],
  ])
  const solid = jscad.primitives.cuboid({ size: [4, 6, 2] })
  const clearance = jscad.primitives.sphere({ radius: 5, segments: 12 })
  const before = JSON.stringify({ path, solid, clearance })
  function Part() {
    return (
      <Translate offset={[10, 20, 30]}>
        <Rotate angles={[Math.PI / 2, 0, Math.PI / 2]}>
          <Custom geometry={solid} />
          <Custom name="bent_path" geometry={path} reference />
          <Custom name="clearance_volume" geometry={clearance} reference />
        </Rotate>
      </Translate>
    )
  }
  const model = renderToJscadModel(<Part />, jscad)
  expect(model.geometries).toHaveLength(1)
  expect(listJscadReferenceFeatures(model)).toEqual([
    "bent_path",
    "clearance_volume",
  ])
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
  const volume = readJscadReferenceFeature(model, "clearance_volume")
  expect(jscad.geometries.geom3.isA(volume.geometry)).toBe(true)
  expect(volume.matrix.slice(12, 15)).toEqual([10, 20, 30])
  expect(() => readJscadNamedEdge(model, "clearance_volume")).toThrow(
    "not a geom2 or path2 feature",
  )
  expect(JSON.stringify({ path, solid, clearance })).toBe(before)
})
