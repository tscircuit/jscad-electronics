import jscad from "@jscad/modeling"
import {
  flangeBearingModelPropsSchema,
  type FlangeBearingModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  motionCylinder,
  motionRing,
  motionBox,
} from "../../mechanical/motion-geometry-utils"
const { primitives } = jscad
const { union, subtract } = jscad.booleans
const { translate } = jscad.transforms
/** Square four-bolt flange bearing with an axial Z shaft bore and open top rolling-element race. Flange bottom is Z=0. Nominal assembly envelope and race clearances; not a manufacturer part or load-rated design. */
export function createFlangeBearingGeom(
  input: FlangeBearingModelPropsInput = {},
) {
  const p = flangeBearingModelPropsSchema.parse(input)

  const total = p.flangeThickness + p.housingHeight
  const raceOuter = p.boreDiameter + (p.housingDiameter - p.boreDiameter) * 0.72
  const body = union(
    motionBox(p.flangeWidth, p.flangeWidth, p.flangeThickness, [
      0,
      0,
      p.flangeThickness / 2,
    ]),
    motionCylinder(p.housingDiameter, p.housingHeight, p.flangeThickness),
  )
  const holes = [-1, 1].flatMap((x) =>
    [-1, 1].map((y) =>
      translate(
        [(x * p.mountSpacing) / 2, (y * p.mountSpacing) / 2, 0],
        motionCylinder(p.mountHoleDiameter, total + 0.4, -0.2),
      ),
    ),
  )
  const housing = subtract(
    body,
    motionCylinder(raceOuter, total + 0.4, -0.2),
    ...holes,
  )
  const ballRadius = ((raceOuter - p.boreDiameter - 6) / 4) * 0.85
  const bearing = union(
    motionRing(raceOuter + 0.04, raceOuter - 3, total),
    motionRing(p.boreDiameter + 3, p.boreDiameter, total),
    ...Array.from({ length: 10 }, (_, i) => {
      const angle = (i * 2 * Math.PI) / 10,
        radius = (raceOuter + p.boreDiameter) / 4
      return primitives.sphere({
        radius: ballRadius,
        segments: 16,
        center: [
          radius * Math.cos(angle),
          radius * Math.sin(angle),
          total - ballRadius,
        ],
      })
    }),
  )
  return union(housing, bearing)
}
export function createFlangeBearingMesh(
  input: FlangeBearingModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createFlangeBearingGeom(input))
}
