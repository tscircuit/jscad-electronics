import {
  Colorize,
  Cuboid,
  Cylinder,
  Rotate,
  Subtract,
  Translate,
} from "jscad-fiber"
import type { PcbPlatedHole } from "circuit-json"
import { FootprintPlatedHole } from "./FootprintPlatedHole"

interface JSXH2_5mmProps {
  numPins?: number
  showPins?: boolean
  showFootprint?: boolean
  bodyColor?: string
  pinColor?: string
}

export const JSXH2_5mm = ({
  numPins = 4,
  showPins = true,
  showFootprint = true,
  bodyColor = "#333333",
  pinColor = "#c0c0c0",
}: JSXH2_5mmProps) => {
  const pitch = 2.5
  const bodyHeight = 7
  const bodyDepth = 5.7
  const wallThickness = 0.6
  const hollowHeight = bodyHeight * 0.65
  const pinLength = 9.8 - bodyHeight
  const marginWidth = 5.0
  const bodyWidth = (numPins - 1) * pitch + marginWidth
  const startX = -((numPins - 1) * pitch) / 2

  return (
    <>
      {/* Housing Body */}
      <Translate offset={[0, 0, bodyHeight]}>
        <Rotate angles={[Math.PI, 0, 0]}>
          <Colorize color={bodyColor}>
            <Subtract>
              {/* Main body */}
              <Cuboid
                size={[bodyWidth, bodyDepth, bodyHeight]}
                center={[0, 0, bodyHeight / 2]}
              />
              {/* Hollow cavity */}
              <Cuboid
                size={[
                  bodyWidth - wallThickness * 2,
                  bodyDepth - wallThickness * 2,
                  hollowHeight,
                ]}
                center={[0, 0, hollowHeight / 2]}
              />
              {/* Central divider removal */}
              <Cuboid
                size={[bodyWidth, bodyDepth / 2.5, hollowHeight]}
                center={[0, 0, hollowHeight / 2]}
              />
              {/* Top wall reinforcing ribs */}
              <Cuboid
                size={[
                  bodyWidth - wallThickness * 2,
                  wallThickness * 1.5,
                  hollowHeight / 1.5,
                ]}
                center={[
                  0,
                  bodyDepth / 2 - wallThickness,
                  hollowHeight * 0.5,
                ]}
              />
              <Cuboid
                size={[
                  bodyWidth - wallThickness * 2,
                  wallThickness * 1.5,
                  hollowHeight / 1.5,
                ]}
                center={[
                  0,
                  -bodyDepth / 2 + wallThickness,
                  hollowHeight * 0.5,
                ]}
              />
              {/* Polarization key notch on left side */}
              <Cuboid
                size={[1.5, bodyDepth + 1, 2]}
                center={[-bodyWidth / 2.5, 0, bodyHeight * 0.4]}
              />
              {/* Locking ramps on sides */}
              <Cuboid
                size={[1, wallThickness + 2, 1.2]}
                center={[-bodyWidth / 3, bodyDepth / 2, bodyHeight * 0.5]}
              />
              <Cuboid
                size={[1, wallThickness + 2, 1.2]}
                center={[bodyWidth / 3, bodyDepth / 2, bodyHeight * 0.5]}
              />
              <Cuboid
                size={[1, wallThickness + 2, 1.2]}
                center={[-bodyWidth / 3, -bodyDepth / 2, bodyHeight * 0.5]}
              />
              <Cuboid
                size={[1, wallThickness + 2, 1.2]}
                center={[bodyWidth / 3, -bodyDepth / 2, bodyHeight * 0.5]}
              />
            </Subtract>
          </Colorize>
        </Rotate>
      </Translate>

      {/* Pins */}
      {showPins &&
        Array.from({ length: numPins }).map((_, i) => (
          <Colorize key={i} color={pinColor}>
            <Cylinder
              height={pinLength}
              radius={0.32}
              center={[startX + i * pitch, 0, bodyHeight / 2]}
            />
          </Colorize>
        ))}

      {/* Footprint Pads */}
      {showFootprint &&
        Array.from({ length: numPins }).map((_, i) => {
          const isPin1 = i === 0
          const hole: PcbPlatedHole = isPin1
            ? {
                type: "pcb_plated_hole",
                pcb_plated_hole_id: `jsxh_${i}`,
                shape: "circular_hole_with_rect_pad",
                x: startX + i * pitch,
                y: 0,
                hole_diameter: 0.95,
                rect_pad_width: 1.5,
                rect_pad_height: 2.2,
                hole_shape: "circle",
                pad_shape: "rect",
                layers: ["top", "bottom"],
                port_hints: [`${i + 1}`],
              }
            : {
                type: "pcb_plated_hole",
                pcb_plated_hole_id: `jsxh_${i}`,
                shape: "pill",
                x: startX + i * pitch,
                y: 0,
                hole_height: 0.95,
                hole_width: 0.95,
                outer_height: 2.2,
                outer_width: 1.5,
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

export default JSXH2_5mm
