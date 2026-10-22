import type { RectangularTubeModelPropsInput } from "@tscircuit/modelprinter"
import {
  Colorize,
  ExtrudeLinear,
  Polygon,
  Subtract,
} from "jscad-fiber/headless"
import { getRectangularTubeProfiles } from "./profiles"
export type RectangularTubeProps = RectangularTubeModelPropsInput & {
  color?: string
}
export function RectangularTube({
  color = "#929da9",
  ...props
}: RectangularTubeProps) {
  const { length, outerPoints, innerPoints } = getRectangularTubeProfiles(props)
  return (
    <Colorize color={color}>
      <Subtract>
        <ExtrudeLinear
          height={length}
          topOutlineName="outer_top"
          bottomOutlineName="outer_bottom"
        >
          <Polygon points={outerPoints} />
        </ExtrudeLinear>
        <ExtrudeLinear
          height={length}
          topOutlineName="inner_top"
          bottomOutlineName="inner_bottom"
        >
          <Polygon points={innerPoints} />
        </ExtrudeLinear>
      </Subtract>
    </Colorize>
  )
}
