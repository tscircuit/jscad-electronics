import jscad from "@jscad/modeling"

/** Native model features retained by their geometry constructor. The initial
 * reader supports planar geom2 contours/path2 features at model-local Z=0.
 * Keeping features native preserves closed/curved boundaries and avoids inventing
 * a universal start/end representation or geometry records in Circuit JSON.
 */
export interface NamedJscadModel {
  geometry: jscad.geometries.geom3.Geom3
  namedEdges: Readonly<
    Record<string, jscad.geometries.geom2.Geom2 | jscad.geometries.path2.Path2>
  >
}

export interface JscadNamedEdgePath {
  points: { x: number; y: number; z: number }[]
  closed: boolean
}

export function listJscadNamedEdges(model: NamedJscadModel): string[] {
  return Object.keys(model.namedEdges)
}

/** Read a named native feature without mutating the source geometry. Returned
 * samples are model-local CAD points in mm (+Z up), not camera/projected points.
 * The caller applies model placement before supplying world points to a drawing
 * exporter; transforms to model.geometry alone do not place the retained features.
 */
export function readJscadNamedEdge(
  model: NamedJscadModel,
  name: string,
): JscadNamedEdgePath {
  if (!Object.hasOwn(model.namedEdges, name))
    throw new Error(`JSCAD model does not define named edge "${name}"`)
  const feature = model.namedEdges[name]!
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
    points: points.map(([x, y]) => ({ x: x!, y: y!, z: 0 })),
    closed,
  }
}
