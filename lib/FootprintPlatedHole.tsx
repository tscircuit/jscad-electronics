import type { PcbPlatedHole } from "circuit-json"
import { Colorize, Cuboid, Translate, Cylinder, Subtract } from "jscad-fiber"

export const FootprintPlatedHole = ({ hole }: { hole: PcbPlatedHole }) => {
  if (hole.shape === "circle") {
    return (
      <Colorize color="#b87333">
        <Translate offset={[hole.x, hole.y, 0]}>
          {/* <Rotate axis="z" angle={90}> */}
          <Subtract>
            <Cylinder radius={hole.outer_diameter / 2} height={0.01} />
            <Cylinder radius={hole.hole_diameter / 2} height={0.01} />
          </Subtract>
          {/* </Rotate> */}
        </Translate>
      </Colorize>
    )
  }
  if (hole.shape === "circular_hole_with_rect_pad") {
    return (
      <Colorize color="#b87333">
        <Translate offset={[hole.x, hole.y, 0]}>
          {/* <Rotate axis="z" angle={90}> */}
          <Subtract>
            <Cuboid
              size={[hole.rect_pad_width, hole.rect_pad_width, 0.01]}
              center={[0, 0, 0]}
            />
            <Cylinder radius={hole.hole_diameter / 2} height={0.01} />
          </Subtract>
          {/* </Rotate> */}
        </Translate>
      </Colorize>
    )
  }
  throw new Error("Shape not supported: " + hole.shape)
}
