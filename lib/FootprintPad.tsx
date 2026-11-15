import { componentMaterials } from "./materials"
import type { PcbSmtPad } from "circuit-json"
import {
  Colorize,
  Cuboid,
  Cylinder,
  ExtrudeLinear,
  Hull,
  Polygon,
  Rotate,
  Translate,
} from "jscad-fiber"

const PAD_THICKNESS = 0.01

export const FootprintPad = ({
  pad,
  isPin1,
}: { pad: PcbSmtPad; isPin1?: boolean }) => {
  const color: [number, number, number] = isPin1 ? [0, 255, 0] : [255, 0, 0]

  if (pad.shape === "rect" || pad.shape === "rotated_rect") {
    return (
      <Colorize color={color} material={componentMaterials.copper}>
        <Translate offset={[pad.x, pad.y, -0.005]}>
          <Rotate
            angles={[
              0,
              0,
              pad.shape === "rotated_rect"
                ? (pad.ccw_rotation * Math.PI) / 180
                : 0,
            ]}
          >
            <Cuboid size={[pad.width, pad.height, PAD_THICKNESS]} />
          </Rotate>
        </Translate>
      </Colorize>
    )
  }

  if (pad.shape === "circle") {
    const radius = (pad as any).radius ?? (pad as any).r ?? 0.25
    return (
      <Colorize color={color} material={componentMaterials.copper}>
        <Translate offset={[pad.x, pad.y, -0.005]}>
          <Cylinder radius={radius} height={PAD_THICKNESS} />
        </Translate>
      </Colorize>
    )
  }

  // A polygon pad is how footprinter describes a tab — SOT-89's, for one. It
  // used to throw, which meant a footprint could not be rendered WITH ITS PADS
  // at all, and the failure named the shape rather than the footprint.
  if (pad.shape === "polygon") {
    const points = (pad.points ?? []).map(
      ({ x, y }) => [x, y] as [number, number],
    )
    if (points.length < 3) return null
    return (
      <Colorize color={color} material={componentMaterials.copper}>
        <Translate offset={[0, 0, -0.005]}>
          <ExtrudeLinear height={PAD_THICKNESS}>
            <Polygon points={points} />
          </ExtrudeLinear>
        </Translate>
      </Colorize>
    )
  }

  if (pad.shape === "pill" || pad.shape === "rotated_pill") {
    const width = pad.width ?? 0.5
    const height = pad.height ?? 0.5
    const radius = Math.min(width, height) / 2
    const isHorizontal = width >= height
    const rotationRad =
      pad.shape === "rotated_pill"
        ? (((pad as any).ccw_rotation ?? 0) * Math.PI) / 180
        : 0

    return (
      <Colorize color={color} material={componentMaterials.copper}>
        <Translate offset={[pad.x, pad.y, -0.005]}>
          <Rotate angles={[0, 0, rotationRad]}>
            {width === height ? (
              <Cylinder radius={radius} height={PAD_THICKNESS} />
            ) : (
              <Hull>
                <Cylinder
                  radius={radius}
                  height={PAD_THICKNESS}
                  center={[
                    isHorizontal ? -(width / 2 - radius) : 0,
                    isHorizontal ? 0 : -(height / 2 - radius),
                    0,
                  ]}
                />
                <Cylinder
                  radius={radius}
                  height={PAD_THICKNESS}
                  center={[
                    isHorizontal ? width / 2 - radius : 0,
                    isHorizontal ? 0 : height / 2 - radius,
                    0,
                  ]}
                />
              </Hull>
            )}
          </Rotate>
        </Translate>
      </Colorize>
    )
  }

  throw new Error("Shape not supported: " + pad.shape)
}
