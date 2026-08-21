import type { PcbPlatedHole } from "circuit-json"
import {
  Colorize,
  Cuboid,
  Cylinder,
  Rotate,
  Subtract,
  Translate,
} from "jscad-fiber"
import { FootprintPlatedHole } from "./FootprintPlatedHole"

interface JSTPH2_0mmProps {
  numPins?: number
  showPins?: boolean
  showFootprint?: boolean
  bodyColor?: string
  pinColor?: string
}

export const JSTPH2_0mm = ({
  numPins = 2,
  showPins = true,
  showFootprint = true,
  bodyColor = "#f5f5f5",
  pinColor = "#635959",
}: JSTPH2_0mmProps) => {
  const pitch = 2.0
  // BxB-PH-K-S top-entry through-hole header dimensions from the JST drawing.
  const bodyHeight = 6
  const bodyDepth = 4.5
  const wallThickness = 0.5
  const hollowHeight = bodyHeight * 0.6
  const pinTailLength = 3.4
  const pinTop = 5.5
  // JST specifies a 0.5 mm square post for the through-hole header.
  const pinThickness = 0.5
  const pinLength = pinTailLength + pinTop
  const bodyWidth = (numPins - 1) * pitch + 3.9
  const startX = -((numPins - 1) * pitch) / 2
  const latchWindowWidth = 1
  const latchWindowHeight = 1.8
  const latchWindowInset = 0.7
  const topReliefWidth = 0.8
  const topReliefDepth = 0.65

  return (
    <>
      <Translate offset={[0, 0, bodyHeight]}>
        <Rotate angles={[Math.PI, 0, 0]}>
          <Colorize color={bodyColor}>
            <Subtract>
              <Cuboid
                size={[bodyWidth, bodyDepth, bodyHeight]}
                center={[0, 0, bodyHeight / 2]}
              />
              <Cuboid
                size={[
                  bodyWidth - wallThickness * 2,
                  bodyDepth - wallThickness * 2,
                  hollowHeight,
                ]}
                center={[0, 0, hollowHeight / 2]}
              />
              <Cuboid
                size={[bodyWidth, bodyDepth / 3, hollowHeight]}
                center={[0, 0, hollowHeight / 6]}
              />
              <Cuboid
                size={[
                  bodyWidth - wallThickness * 2,
                  wallThickness / 2,
                  hollowHeight,
                ]}
                center={[
                  0,
                  bodyDepth / 2 - wallThickness / 4,
                  hollowHeight / 2,
                ]}
              />
              <Cuboid
                size={[
                  bodyWidth - wallThickness * 2,
                  wallThickness / 2,
                  hollowHeight,
                ]}
                center={[
                  0,
                  -bodyDepth / 2 + wallThickness / 4,
                  hollowHeight / 2,
                ]}
              />
              <Cuboid
                size={[
                  latchWindowWidth,
                  bodyDepth + wallThickness,
                  latchWindowHeight,
                ]}
                center={[-bodyWidth / 2 + latchWindowInset, 0, bodyHeight / 2]}
              />
              <Cuboid
                size={[
                  latchWindowWidth,
                  bodyDepth + wallThickness,
                  latchWindowHeight,
                ]}
                center={[bodyWidth / 2 - latchWindowInset, 0, bodyHeight / 2]}
              />
              <Cuboid
                size={[wallThickness * 3, topReliefWidth, topReliefDepth]}
                center={[-bodyWidth / 2, 0, topReliefDepth / 2]}
              />
              <Translate offset={[-bodyWidth / 2, 0, topReliefDepth]}>
                <Rotate angles={[0, Math.PI / 2, 0]}>
                  <Cylinder
                    height={wallThickness * 3}
                    radius={topReliefWidth / 2}
                  />
                </Rotate>
              </Translate>
              <Cuboid
                size={[wallThickness * 3, topReliefWidth, topReliefDepth]}
                center={[bodyWidth / 2, 0, topReliefDepth / 2]}
              />
              <Translate offset={[bodyWidth / 2, 0, topReliefDepth]}>
                <Rotate angles={[0, Math.PI / 2, 0]}>
                  <Cylinder
                    height={wallThickness * 3}
                    radius={topReliefWidth / 2}
                  />
                </Rotate>
              </Translate>
            </Subtract>
          </Colorize>
        </Rotate>
      </Translate>

      {showPins &&
        Array.from({ length: numPins }).map((_, i) => (
          <Colorize key={i} color={pinColor}>
            <Cuboid
              size={[pinThickness, pinThickness, pinLength]}
              center={[startX + i * pitch, 0, (pinTop - pinTailLength) / 2]}
            />
          </Colorize>
        ))}

      {showFootprint &&
        Array.from({ length: numPins }).map((_, i) => {
          const isPin1 = i === 0
          const hole: any = isPin1
            ? {
                type: "pcb_plated_hole",
                pcb_plated_hole_id: `jstph_${i}`,
                shape: "circular_hole_with_rect_pad",
                x: startX + i * pitch,
                y: 0,
                hole_diameter: 0.73,
                rect_pad_width: 1.2,
                rect_pad_height: 1.2,
                hole_shape: "circle",
                pad_shape: "rect",
                layers: ["top", "bottom"],
                port_hints: [`${i + 1}`],
              }
            : {
                type: "pcb_plated_hole",
                pcb_plated_hole_id: `jstph_${i}`,
                shape: "pill",
                x: startX + i * pitch,
                y: 0,
                hole_height: 0.73,
                hole_width: 0.73,
                outer_height: 1.2,
                outer_width: 1.2,
                ccw_rotation: 0,
                layers: ["top", "bottom"],
                port_hints: [`${i + 1}`],
              }
          return (
            <FootprintPlatedHole
              key={`footprint_${i}`}
              hole={hole}
              isPin1={isPin1}
            />
          )
        })}
    </>
  )
}

export default JSTPH2_0mm
