import type { PcbPlatedHole } from "circuit-json"
import {
  Colorize,
  Cuboid,
  Translate,
  Cylinder,
  Subtract,
  Hull,
} from "jscad-fiber"

export const FootprintPlatedHole = ({
  hole,
  isPin1,
}: { hole: PcbPlatedHole; isPin1?: boolean }) => {
  const color = isPin1 ? "#00ff00" : "#b87333"

  if (hole.shape === "circle") {
    return (
      <Colorize color={color}>
        <Translate offset={[hole.x, hole.y, -0.005]}>
          <Subtract>
            <Cylinder radius={hole.outer_diameter / 2} height={0.01} />
            <Cylinder radius={hole.hole_diameter / 2} height={0.01} />
          </Subtract>
        </Translate>
      </Colorize>
    )
  }
  if (hole.shape === "circular_hole_with_rect_pad") {
    return (
      <Colorize color={color}>
        <Translate offset={[hole.x, hole.y, 0]}>
          <Subtract>
            <Cuboid
              size={[hole.rect_pad_width, hole.rect_pad_width, 0.01]}
              center={[0, 0, 0]}
            />
            <Cylinder radius={hole.hole_diameter / 2} height={0.01} />
          </Subtract>
        </Translate>
      </Colorize>
    )
  }
  if (hole.shape === "pill") {
    const width = hole.outer_width
    const height = hole.outer_height
    const radius = Math.min(width, height) / 2
    const isHorizontal = width > height

    const holeWidth = hole.hole_width ?? 0.8
    const holeHeight = hole.hole_height ?? 0.8

    return (
      <Colorize color={color}>
        <Translate offset={[hole.x, hole.y, 0]}>
          <Subtract>
            <Hull>
              <Cylinder
                radius={radius}
                height={0.01}
                center={[
                  isHorizontal ? -(width / 2 - radius) : 0,
                  isHorizontal ? 0 : -(height / 2 - radius),
                  0,
                ]}
              />
              <Cylinder
                radius={radius}
                height={0.01}
                center={[
                  isHorizontal ? width / 2 - radius : 0,
                  isHorizontal ? 0 : height / 2 - radius,
                  0,
                ]}
              />
            </Hull>
            {holeWidth === holeHeight ? (
              <Cylinder radius={holeWidth / 2} height={0.01} />
            ) : (
              <Hull>
                <Cylinder
                  radius={Math.min(holeWidth, holeHeight) / 2}
                  height={0.01}
                  center={[
                    holeWidth > holeHeight
                      ? -(holeWidth / 2 - holeHeight / 2)
                      : 0,
                    holeWidth > holeHeight
                      ? 0
                      : -(holeHeight / 2 - holeWidth / 2),
                    0,
                  ]}
                />
                <Cylinder
                  radius={Math.min(holeWidth, holeHeight) / 2}
                  height={0.01}
                  center={[
                    holeWidth > holeHeight ? holeWidth / 2 - holeHeight / 2 : 0,
                    holeWidth > holeHeight ? 0 : holeHeight / 2 - holeWidth / 2,
                    0,
                  ]}
                />
              </Hull>
            )}
          </Subtract>
        </Translate>
      </Colorize>
    )
  }
  throw new Error("Shape not supported: " + hole.shape)
}
