import type { PcbPlatedHole } from "circuit-json"
import {
  Colorize,
  Cuboid,
  Cylinder,
  ExtrudeLinear,
  Hull,
  Polygon,
  Rotate,
  Subtract,
  Translate,
} from "jscad-fiber"
import { PillHull, rotateZDeg } from "./utils/pill-hull"

const COPPER_THICKNESS = 0.01

const wrapZRotation = (degrees: number, children: any) => {
  if (!degrees) return children
  return <Rotate rotation={[0, 0, `${degrees}deg`]}>{children}</Rotate>
}

const rotateXy = (x: number, y: number, degrees: number) => {
  const rad = (degrees * Math.PI) / 180
  return {
    x: x * Math.cos(rad) - y * Math.sin(rad),
    y: x * Math.sin(rad) + y * Math.cos(rad),
  }
}

const pillDrill = (width: number, height: number) => {
  if (width === height) {
    return <Cylinder radius={width / 2} height={COPPER_THICKNESS} />
  }
  return <PillHull width={width} height={height} thickness={COPPER_THICKNESS} />
}

export const FootprintPlatedHole = ({
  hole,
  isPin1,
}: { hole: PcbPlatedHole; isPin1?: boolean }) => {
  const color = isPin1 ? "#00ff00" : "#b87333"
  const shape = (hole as { shape: string }).shape

  if (hole.shape === "circle") {
    return (
      <Colorize color={color}>
        <Translate offset={[hole.x, hole.y, -0.005]}>
          <Subtract>
            <Cylinder
              radius={hole.outer_diameter / 2}
              height={COPPER_THICKNESS}
            />
            <Cylinder
              radius={hole.hole_diameter / 2}
              height={COPPER_THICKNESS}
            />
          </Subtract>
        </Translate>
      </Colorize>
    )
  }
  if (hole.shape === "circular_hole_with_rect_pad") {
    const rect = hole as typeof hole & {
      rect_pad_width: number
      rect_pad_height: number
      hole_diameter: number
      hole_offset_x?: number
      hole_offset_y?: number
      rect_ccw_rotation?: number
    }
    const ox = Number(rect.hole_offset_x) || 0
    const oy = Number(rect.hole_offset_y) || 0
    return (
      <Colorize color={color}>
        <Translate offset={[hole.x, hole.y, 0]}>
          <Subtract>
            {wrapZRotation(
              rotateZDeg(rect.rect_ccw_rotation),
              <Cuboid
                size={[
                  rect.rect_pad_width,
                  rect.rect_pad_height,
                  COPPER_THICKNESS,
                ]}
                center={[0, 0, 0]}
              />,
            )}
            <Translate offset={[ox, oy, 0]}>
              <Cylinder
                radius={rect.hole_diameter / 2}
                height={COPPER_THICKNESS}
              />
            </Translate>
          </Subtract>
        </Translate>
      </Colorize>
    )
  }
  if (hole.shape === "pill" || hole.shape === "oval") {
    const width = hole.outer_width
    const height = hole.outer_height
    const radius = Math.min(width, height) / 2
    const isHorizontal = width > height
    const holeWidth = hole.hole_width ?? 0.8
    const holeHeight = hole.hole_height ?? 0.8
    const ccwRotation = rotateZDeg(
      (hole as { ccw_rotation?: number }).ccw_rotation,
    )

    return (
      <Colorize color={color}>
        <Translate offset={[hole.x, hole.y, 0]}>
          {wrapZRotation(
            ccwRotation,
            <Subtract>
              <Hull>
                <Cylinder
                  radius={radius}
                  height={COPPER_THICKNESS}
                  center={[
                    isHorizontal ? -(width / 2 - radius) : 0,
                    isHorizontal ? 0 : -(height / 2 - radius),
                    0,
                  ]}
                />
                <Cylinder
                  radius={radius}
                  height={COPPER_THICKNESS}
                  center={[
                    isHorizontal ? width / 2 - radius : 0,
                    isHorizontal ? 0 : height / 2 - radius,
                    0,
                  ]}
                />
              </Hull>
              {pillDrill(holeWidth, holeHeight)}
            </Subtract>,
          )}
        </Translate>
      </Colorize>
    )
  }
  if (shape === "pill_hole_with_rect_pad") {
    const rect = hole as typeof hole & {
      rect_pad_width: number
      rect_pad_height: number
      hole_width: number
      hole_height: number
      hole_offset_x?: number
      hole_offset_y?: number
    }
    const ox = Number(rect.hole_offset_x) || 0
    const oy = Number(rect.hole_offset_y) || 0
    return (
      <Colorize color={color}>
        <Translate offset={[hole.x, hole.y, 0]}>
          <Subtract>
            <Cuboid
              size={[
                rect.rect_pad_width,
                rect.rect_pad_height,
                COPPER_THICKNESS,
              ]}
              center={[0, 0, 0]}
            />
            <Translate offset={[ox, oy, 0]}>
              {pillDrill(rect.hole_width, rect.hole_height)}
            </Translate>
          </Subtract>
        </Translate>
      </Colorize>
    )
  }
  if (shape === "rotated_pill_hole_with_rect_pad") {
    const rect = hole as typeof hole & {
      rect_pad_width: number
      rect_pad_height: number
      hole_width: number
      hole_height: number
      hole_offset_x?: number
      hole_offset_y?: number
      rect_ccw_rotation?: number
      hole_ccw_rotation?: number
    }
    const padRot = rotateZDeg(rect.rect_ccw_rotation)
    const holeRot = rotateZDeg(rect.hole_ccw_rotation)
    const offset = rotateXy(
      Number(rect.hole_offset_x) || 0,
      Number(rect.hole_offset_y) || 0,
      padRot,
    )
    return (
      <Colorize color={color}>
        <Translate offset={[hole.x, hole.y, 0]}>
          <Subtract>
            {wrapZRotation(
              padRot,
              <Cuboid
                size={[
                  rect.rect_pad_width,
                  rect.rect_pad_height,
                  COPPER_THICKNESS,
                ]}
                center={[0, 0, 0]}
              />,
            )}
            <Translate offset={[offset.x, offset.y, 0]}>
              {wrapZRotation(
                holeRot,
                pillDrill(rect.hole_width, rect.hole_height),
              )}
            </Translate>
          </Subtract>
        </Translate>
      </Colorize>
    )
  }
  if (shape === "hole_with_polygon_pad") {
    const poly = hole as typeof hole & {
      pad_outline: Array<{ x: number; y: number }>
      hole_shape?: string
      hole_diameter?: number
      hole_width?: number
      hole_height?: number
      hole_offset_x?: number
      hole_offset_y?: number
      ccw_rotation?: number
    }
    const deg = rotateZDeg(poly.ccw_rotation)
    const points = (poly.pad_outline ?? []).map((p) => {
      const r = rotateXy(Number(p.x), Number(p.y), deg)
      return [r.x, r.y] as [number, number]
    })
    if (points.length < 3) return null
    const drillOffset = rotateXy(
      Number(poly.hole_offset_x) || 0,
      Number(poly.hole_offset_y) || 0,
      deg,
    )
    const holeWidth = poly.hole_width ?? poly.hole_diameter ?? 0.8
    const holeHeight = poly.hole_height ?? poly.hole_diameter ?? holeWidth
    return (
      <Colorize color={color}>
        <Translate offset={[hole.x, hole.y, 0]}>
          <Subtract>
            <ExtrudeLinear height={COPPER_THICKNESS}>
              <Polygon points={points} />
            </ExtrudeLinear>
            <Translate offset={[drillOffset.x, drillOffset.y, 0]}>
              {wrapZRotation(deg, pillDrill(holeWidth, holeHeight))}
            </Translate>
          </Subtract>
        </Translate>
      </Colorize>
    )
  }
  throw new Error("Shape not supported: " + shape)
}
