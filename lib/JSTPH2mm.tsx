import type { PcbPlatedHole } from "circuit-json"
import {
  Colorize,
  Cuboid,
  Cylinder,
  Rotate,
  RoundedCuboid,
  Subtract,
  Translate,
} from "jscad-fiber"
import { FootprintPlatedHole } from "./FootprintPlatedHole"

export interface JSTPH2mmProps {
  numPins?: number
  pitch?: number
  bodyWidth?: number
  bodyDepth?: number
  bodyHeight?: number
  pinRowY?: number
  holeDiameter?: number
  padWidth?: number
  padLength?: number
  showPins?: boolean
  showFootprint?: boolean
  bodyColor?: string
  pinColor?: string
}

/**
 * Parametric JST PH-style, side-entry through-hole header.
 *
 * The body follows the PH family envelope while the pin locations and pad
 * dimensions can be driven directly by a footprinter definition.
 */
export const JSTPH2mm = ({
  numPins = 2,
  pitch = 2,
  bodyWidth,
  bodyDepth = 5,
  bodyHeight = 6,
  pinRowY = 2,
  holeDiameter = 0.7,
  padWidth = 1.2,
  padLength = 1.2,
  showPins = true,
  showFootprint = true,
  bodyColor = "#f2eee1",
  pinColor = "#b9a56b",
}: JSTPH2mmProps) => {
  const pinSpan = (numPins - 1) * pitch
  const resolvedBodyWidth = Math.max(bodyWidth ?? 0, pinSpan + 3.9)
  const bodyCenterY = pinRowY - bodyDepth / 2 + 0.5
  const bodyBottom = 0.2
  const cavityDepth = Math.min(bodyDepth * 0.56, 2.8)
  const cavityCenterY = bodyCenterY - bodyDepth / 2 + cavityDepth / 2 - 0.05
  const cavityHeight = Math.max(bodyHeight - 1.5, 2)
  const startX = -pinSpan / 2
  const pinRadius = Math.max(0.2, Math.min(holeDiameter * 0.37, 0.32))
  const horizontalPinEndY = bodyCenterY + bodyDepth * 0.05
  const horizontalPinLength = Math.max(pinRowY - horizontalPinEndY, 0.8)

  return (
    <>
      <Colorize color={bodyColor}>
        <Subtract>
          <RoundedCuboid
            size={[resolvedBodyWidth, bodyDepth, bodyHeight]}
            center={[0, bodyCenterY, bodyBottom + bodyHeight / 2]}
            roundRadius={0.16}
          />
          <Cuboid
            size={[resolvedBodyWidth - 1.15, cavityDepth + 0.2, cavityHeight]}
            center={[0, cavityCenterY, bodyBottom + 0.75 + cavityHeight / 2]}
          />
          <Cuboid
            size={[0.8, 0.55, 0.5]}
            center={[
              -resolvedBodyWidth / 2 + 0.85,
              bodyCenterY - bodyDepth / 2,
              bodyBottom + bodyHeight - 0.25,
            ]}
          />
        </Subtract>

        <Cuboid
          size={[resolvedBodyWidth - 0.7, 0.32, 0.45]}
          center={[
            0,
            bodyCenterY + bodyDepth / 2 - 0.16,
            bodyBottom + bodyHeight - 0.55,
          ]}
        />
      </Colorize>

      {showPins &&
        Array.from({ length: numPins }).map((_, index) => {
          const x = startX + index * pitch
          return (
            <Colorize key={`pin:${index}`} color={pinColor}>
              <Cylinder
                center={[x, pinRowY, 0.4]}
                height={3.6}
                radius={pinRadius}
              />
              <Translate
                offset={[
                  x,
                  (pinRowY + horizontalPinEndY) / 2,
                  bodyBottom + 1.65,
                ]}
              >
                <Rotate rotation={[Math.PI / 2, 0, 0]}>
                  <Cylinder height={horizontalPinLength} radius={pinRadius} />
                </Rotate>
              </Translate>
            </Colorize>
          )
        })}

      {showFootprint &&
        Array.from({ length: numPins }).map((_, index) => {
          const hole: PcbPlatedHole = {
            type: "pcb_plated_hole",
            pcb_plated_hole_id: `jstph_${index}`,
            shape: "circular_hole_with_rect_pad",
            x: startX + index * pitch,
            y: pinRowY,
            hole_diameter: holeDiameter,
            hole_shape: "circle",
            pad_shape: "rect",
            rect_pad_width: padWidth,
            rect_pad_height: padLength,
            layers: ["top", "bottom"],
            port_hints: [`${index + 1}`],
          }
          return (
            <FootprintPlatedHole
              key={`footprint:${index}`}
              hole={hole}
              isPin1={index === 0}
            />
          )
        })}
    </>
  )
}

export default JSTPH2mm
