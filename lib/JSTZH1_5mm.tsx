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

interface JSTZH1_5mmProps {
  numPins?: number
  showPins?: boolean
  showFootprint?: boolean
  bodyColor?: string
  pinColor?: string
}

export const JSTZH1_5mm = ({
  numPins = 7,
  showPins = true,
  showFootprint = true,
  bodyColor = "#f5f5f5",
  pinColor = "#635959",
}: JSTZH1_5mmProps) => {
  const pitch = 1.5
  const bodyHeight = 6
  const bodyDepth = 3.5
  const wallThickness = 0.5
  const hollowHeight = bodyHeight * 0.6
  const pinLength = 6
  const bodyWidth = (numPins - 1) * pitch + 4
  const startX = -((numPins - 1) * pitch) / 2

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
                size={[1, wallThickness + 2, 1]}
                center={[-bodyWidth / 4, bodyDepth / 2, bodyHeight / 2]}
              />
              <Cuboid
                size={[1, wallThickness + 3, 1]}
                center={[bodyWidth / 4, bodyDepth / 2, bodyHeight / 2]}
              />
              <Cuboid
                size={[1, wallThickness + 2, 1]}
                center={[-bodyWidth / 4, -bodyDepth / 2, bodyHeight / 2]}
              />
              <Cuboid
                size={[1, wallThickness + 3, 1]}
                center={[bodyWidth / 4, -bodyDepth / 2, bodyHeight / 2]}
              />
            </Subtract>
          </Colorize>
        </Rotate>
      </Translate>

      {showPins &&
        Array.from({ length: numPins }).map((_, i) => (
          <Colorize key={i} color={pinColor}>
            <Cylinder
              height={pinLength}
              radius={0.35}
              center={[startX + i * pitch, 0, 2.5]}
            />
          </Colorize>
        ))}

      {showFootprint &&
        Array.from({ length: numPins }).map((_, i) => {
          const isPin1 = i === 0
          const hole: PcbPlatedHole = isPin1
            ? {
                type: "pcb_plated_hole",
                pcb_plated_hole_id: `jstzh_${i}`,
                shape: "circular_hole_with_rect_pad",
                x: startX + i * pitch,
                y: 0,
                hole_diameter: 0.73,
                rect_pad_width: 1.03,
                rect_pad_height: 1.73,
                hole_shape: "circle",
                pad_shape: "rect",
                layers: ["top", "bottom"],
                port_hints: [`${i + 1}`],
              }
            : {
                type: "pcb_plated_hole",
                pcb_plated_hole_id: `jstzh_${i}`,
                shape: "pill",
                x: startX + i * pitch,
                y: 0,
                hole_height: 0.73,
                hole_width: 0.73,
                outer_height: 1.73,
                outer_width: 1.03,
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

export default JSTZH1_5mm
