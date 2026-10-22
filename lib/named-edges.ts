import jscad from "@jscad/modeling"
import type { JscadModel, JscadReferenceFeature } from "jscad-fiber/model"

/** Model output collected from names declared in the Fiber component tree. */
export type NamedJscadModel = JscadModel

export interface JscadNamedEdgePath {
  points: { x: number; y: number; z: number }[]
  closed: boolean
}

export function listJscadNamedEdges(model: NamedJscadModel): string[] {
  return listJscadReferenceFeatures(model).filter((name) => {
    const { geometry } = model.referenceFeatures[name]!
    return (
      jscad.geometries.geom2.isA(geometry) ||
      jscad.geometries.path2.isA(geometry)
    )
  })
}

export function listJscadReferenceFeatures(model: NamedJscadModel): string[] {
  return Object.keys(model.referenceFeatures)
}

/** Other consumers can use the same declared names for native solid, face or
 * profile features, without forcing them into an edge measurement contract.
 */
export function readJscadReferenceFeature(
  model: NamedJscadModel,
  name: string,
): JscadReferenceFeature {
  if (!Object.hasOwn(model.referenceFeatures, name))
    throw new Error(`JSCAD model does not define named feature "${name}"`)
  return model.referenceFeatures[name]!
}

/** Read a planar native edge with its complete Fiber ancestor placement. Samples
 * are CAD mm (+Z up) relative to the rendered model root. The caller applies any
 * outer CAD component placement before passing points to a drawing exporter.
 */
export function readJscadNamedEdge(
  model: NamedJscadModel,
  name: string,
): JscadNamedEdgePath {
  const { geometry: feature, matrix } = readJscadReferenceFeature(model, name)
  if (matrix.length !== 16 || !matrix.every(Number.isFinite))
    throw new Error(
      `Named JSCAD feature "${name}" requires a finite 4x4 matrix`,
    )
  let points: number[][]
  let closed: boolean
  if (jscad.geometries.path2.isA(feature)) {
    const path = jscad.geometries.path2.clone(feature)
    points = jscad.geometries.path2.toPoints(path)
    closed = path.isClosed
  } else if (jscad.geometries.geom2.isA(feature)) {
    const outlines = jscad.geometries.geom2.toOutlines(
      jscad.geometries.geom2.clone(feature),
    )
    if (outlines.length !== 1)
      throw new Error(
        `Named JSCAD edge "${name}" must identify one contour; name its boundaries separately`,
      )
    points = outlines[0]!
    closed = true
  } else {
    throw new Error(
      `Named JSCAD edge "${name}" is not a geom2 or path2 feature`,
    )
  }
  if (points.length < 2)
    throw new Error(`Named JSCAD edge "${name}" has no measurable path`)
  return {
    points: points.map(([x, y]) => {
      const point = jscad.maths.vec3.transform(
        jscad.maths.vec3.create(),
        [x!, y!, 0],
        matrix as Parameters<typeof jscad.maths.vec3.transform>[2],
      )
      return { x: point[0]!, y: point[1]!, z: point[2]! }
    }),
    closed,
  }
}
