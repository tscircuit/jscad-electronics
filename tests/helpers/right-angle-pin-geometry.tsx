import * as jscadModeling from "@jscad/modeling"
import { createJSCADRenderer } from "jscad-fiber"
import { PinRow } from "../../lib/PinRow"

export type Bounds = {
  min: { x: number; y: number; z: number }
  max: { x: number; y: number; z: number }
}

const GOLD_CONDUCTOR = (color: number[] | undefined) =>
  color !== undefined && color[0] === 1 && color[1]! > 0.5 && color[2] === 0

const toBounds = (geom: any): Bounds => {
  const [min, max] = jscadModeling.measurements.measureBoundingBox(geom)
  return {
    min: { x: min[0]!, y: min[1]!, z: min[2]! },
    max: { x: max[0]!, y: max[1]!, z: max[2]! },
  }
}

const extent = (bounds: Bounds, axis: "x" | "y" | "z") =>
  bounds.max[axis] - bounds.min[axis]

/**
 * Render a single-pin right-angle header and return the parts by role.
 *
 * Roles are derived from the geometry rather than from render order, so the
 * same helper describes the shape before and after a change to how the pin is
 * assembled: the vertical tail is the conductor that runs furthest in Z, and
 * the mating pin is the conductor that runs furthest in Y.
 */
export const getRightAnglePinParts = (
  props: { invert?: boolean } = {},
): { body: Bounds; tail: Bounds; matingPin: Bounds } => {
  const container: any[] = []
  const { createJSCADRoot } = createJSCADRenderer(jscadModeling as any)
  createJSCADRoot(container).render(
    <PinRow numberOfPins={1} rightangle {...props} />,
  )

  const conductors = container.filter((geom) => GOLD_CONDUCTOR(geom.color))
  const bodies = container.filter((geom) => !GOLD_CONDUCTOR(geom.color))

  if (conductors.length !== 2 || bodies.length !== 1) {
    throw new Error(
      `expected 1 body and 2 conductors, got ${bodies.length} and ${conductors.length}`,
    )
  }

  const conductorBounds = conductors.map(toBounds)
  const [tail, matingPin] = [...conductorBounds].sort(
    (a, b) => extent(b, "z") - extent(a, "z"),
  )

  return { body: toBounds(bodies[0]), tail: tail!, matingPin: matingPin! }
}

/** Shared material per axis; positive on every axis means the two solids meet. */
export const getOverlap = (a: Bounds, b: Bounds) => ({
  x: Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x),
  y: Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y),
  z: Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z),
})
