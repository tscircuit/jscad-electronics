import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  ExtrudeLinear,
  Polygon,
  Rotate,
  Subtract,
  Translate,
} from "jscad-fiber/headless"
import { renderToJscadModel } from "jscad-fiber/model"
import {
  readJscadNamedEdge,
  readJscadReferenceFeature,
} from "../lib/named-edges"

test("named extrusion outlines retain the complete native profile including holes", () => {
  const model = renderToJscadModel(
    <Translate offset={[10, 20, 30]}>
      <Rotate angles={[Math.PI / 2, 0, 0]}>
        <ExtrudeLinear
          height={5}
          twistAngle={Math.PI / 2}
          topOutlineName="cap"
          bottomOutlineName="base"
        >
          <Subtract>
            <Polygon
              points={[
                [-4, -3],
                [4, -3],
                [4, 3],
                [-4, 3],
              ]}
            />
            <Polygon
              points={[
                [-2, -1],
                [2, -1],
                [2, 1],
                [-2, 1],
              ]}
            />
          </Subtract>
        </ExtrudeLinear>
      </Rotate>
    </Translate>,
    jscad,
  )
  expect(model.geometries).toHaveLength(1)
  for (const name of ["cap", "base"]) {
    const feature = readJscadReferenceFeature(model, name)
    if (!jscad.geometries.geom2.isA(feature.geometry))
      throw new Error("Expected full native profile")
    const outlines = jscad.geometries.geom2.toOutlines(
      jscad.geometries.geom2.clone(feature.geometry),
    )
    expect(outlines).toHaveLength(2)
    expect(outlines.map((points) => points.length)).toEqual([4, 4])
    const center = jscad.maths.vec3.transform(
      jscad.maths.vec3.create(),
      [0, 0, 0],
      feature.matrix as jscad.maths.mat4.Mat4,
    )
    expect(center[0]).toBeCloseTo(10, 8)
    expect(center[1]).toBeCloseTo(name === "cap" ? 15 : 20, 8)
    expect(center[2]).toBeCloseTo(30, 8)
    // The drawing path adapter rejects disconnected loops explicitly instead
    // of connecting the outside boundary to its hole with an invented segment.
    expect(() => readJscadNamedEdge(model, name)).toThrow("one contour")
  }
})
