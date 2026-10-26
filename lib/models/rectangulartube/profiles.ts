import jscad from "@jscad/modeling"
import {
  rectangularTubeModelPropsSchema,
  type RectangularTubeModelPropsInput,
} from "@tscircuit/modelprinter"

const roundedRectangle = (width: number, height: number, radius: number) =>
  radius
    ? jscad.primitives.roundedRectangle({
        size: [width, height],
        roundRadius: radius,
        segments: 64,
      })
    : jscad.primitives.rectangle({ size: [width, height] })

/** Native rounded profile samples used by the component's Polygon nodes. */
export function getRectangularTubeProfiles(
  input: RectangularTubeModelPropsInput,
) {
  const p = rectangularTubeModelPropsSchema.parse(input)
  const points = (geometry: jscad.geometries.geom2.Geom2) =>
    jscad.geometries.geom2.toPoints(geometry) as [number, number][]
  return {
    length: p.length,
    outerPoints: points(roundedRectangle(p.width, p.height, p.outerRadius)),
    innerPoints: points(
      roundedRectangle(
        p.width - 2 * p.wallThickness,
        p.height - 2 * p.wallThickness,
        p.innerRadius,
      ),
    ),
  }
}
