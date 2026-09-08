import type { PcbSmtPad } from "circuit-json"
import {
  Colorize,
  Cuboid,
  Cylinder,
  ExtrudeLinear,
  Polygon,
  Rotate,
  Translate,
} from "jscad-fiber"
import { PillHull, rotateZDeg } from "./utils/pill-hull"

const PAD_THICKNESS = 0.01

const wrapZRotation = (degrees: number, children: any) => {
  if (!degrees) return children
  return <Rotate rotation={[0, 0, `${degrees}deg`]}>{children}</Rotate>
}

export const FootprintPad = ({
  pad,
  isPin1,
}: { pad: PcbSmtPad; isPin1?: boolean }) => {
  const color: [number, number, number] = isPin1 ? [0, 255, 0] : [255, 0, 0]

  if (pad.shape === "rect") {
    return (
      <Colorize color={color}>
        <Translate offset={[pad.x, pad.y, -0.005]}>
          <Cuboid size={[pad.width, pad.height, PAD_THICKNESS]} />
        </Translate>
      </Colorize>
    )
  }

  if (pad.shape === "circle") {
    const radius = (pad as any).radius ?? (pad as any).r ?? 0.25
    return (
      <Colorize color={color}>
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
      <Colorize color={color}>
        <Translate offset={[0, 0, -0.005]}>
          <ExtrudeLinear height={PAD_THICKNESS}>
            <Polygon points={points} />
          </ExtrudeLinear>
        </Translate>
      </Colorize>
    )
  }

  const extra = pad as PcbSmtPad & {
    shape: string
    width?: number
    height?: number
    ccw_rotation?: number
    x: number
    y: number
  }

  if (extra.shape === "rotated_rect") {
    return (
      <Colorize color={color}>
        <Translate offset={[extra.x, extra.y, -0.005]}>
          {wrapZRotation(
            rotateZDeg(extra.ccw_rotation),
            <Cuboid
              size={[extra.width ?? 0, extra.height ?? 0, PAD_THICKNESS]}
            />,
          )}
        </Translate>
      </Colorize>
    )
  }

  if (extra.shape === "pill" || extra.shape === "rotated_pill") {
    const rotation =
      extra.shape === "rotated_pill" ? rotateZDeg(extra.ccw_rotation) : 0
    return (
      <Colorize color={color}>
        <Translate offset={[extra.x, extra.y, -0.005]}>
          {wrapZRotation(
            rotation,
            <PillHull
              width={extra.width ?? 0}
              height={extra.height ?? 0}
              thickness={PAD_THICKNESS}
            />,
          )}
        </Translate>
      </Colorize>
    )
  }

  throw new Error("Shape not supported: " + extra.shape)
}
