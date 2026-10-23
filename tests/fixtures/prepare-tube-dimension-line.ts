type Point3 = { x: number; y: number; z: number }
type Point2 = { x: number; y: number }
type View = {
  drawing_part_view_id: string
  direction: string
  center: Point2
  scale: number
}

/** Test-only preparation, representing work owned by a future core renderer.
 * These two orthographic views have an explicit 1:1 scale. The exporter receives
 * only the completed paper-space annotation, without interpreting model edges.
 */
export function prepareTubeDimensionLine(
  id: string,
  view: View,
  samples: readonly Point3[],
  modelCenter: Point3,
  options: {
    orientation: "horizontal" | "vertical"
    offset: number
    clearanceSamples?: readonly Point3[]
    edgeRefName?: string
  },
) {
  if (view.scale !== 1) throw new Error("This fixture requires 1:1 views")
  const project = (point: Point3): Point2 => {
    if (view.direction === "z_positive")
      return {
        x: view.center.x + point.x - modelCenter.x,
        y: view.center.y + point.y - modelCenter.y,
      }
    if (view.direction === "y_negative")
      return {
        x: view.center.x + point.x - modelCenter.x,
        y: view.center.y + point.z - modelCenter.z,
      }
    throw new Error("Unsupported fixture view")
  }
  const points = samples.map(project)
  const clearance = (options.clearanceSamples ?? samples).map(project)
  const horizontal = options.orientation === "horizontal"
  const along = (point: Point2) => (horizontal ? point.x : point.y)
  const across = (point: Point2) => (horizontal ? point.y : -point.x)
  const side = Math.sign(options.offset) || 1
  const extreme = (minimum: boolean) => {
    const bound = (minimum ? Math.min : Math.max)(...points.map(along))
    return points
      .filter((point) => Math.abs(along(point) - bound) < 1e-7)
      .reduce((a, b) => (side * across(b) > side * across(a) ? b : a))
  }
  const edgeRefStart = extreme(true)
  const edgeRefEnd = extreme(false)
  const baseline =
    (side > 0 ? Math.max : Math.min)(...clearance.map(across)) + options.offset
  const onBaseline = (point: Point2): Point2 =>
    horizontal ? { x: point.x, y: baseline } : { x: -baseline, y: point.y }
  return {
    type: "drawing_dimension_line" as const,
    drawing_dimension_line_id: id,
    drawing_part_view_id: view.drawing_part_view_id,
    start: onBaseline(edgeRefStart),
    end: onBaseline(edgeRefEnd),
    text: (along(edgeRefEnd) - along(edgeRefStart)).toFixed(1),
    edge_ref_start: edgeRefStart,
    edge_ref_end: edgeRefEnd,
    ...(options.edgeRefName ? { edge_ref_name: options.edgeRefName } : {}),
  }
}
