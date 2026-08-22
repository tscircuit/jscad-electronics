import { Colorize, Cuboid, Subtract, Translate } from "jscad-fiber"
import type { PcbPlatedHole } from "circuit-json"
import { fp } from "@tscircuit/footprinter"
import { FootprintPlatedHole } from "./FootprintPlatedHole"

export interface JSTXH2_5mmProps {
  numPins?: number
  showPins?: boolean
  showFootprint?: boolean
  bodyColor?: string
  pinColor?: string
}

export const JSTXH2_5mm = ({
  numPins = 4,
  showPins = true,
  showFootprint = true,
  bodyColor = "#f8fafc", // Natural white PA 66 nylon housing per spec
  pinColor = "#635959", // Tin-plated metallic gray posts
}: JSTXH2_5mmProps) => {
  // Official JST XH 2.50mm Top Entry Dimensions (per eXH.pdf B#B-XH-A)
  const pitch = 2.5
  const bodyHeight = 7.0
  const bodyDepth = 5.75
  const wallThickness = 0.85
  const floorThickness = 1.65
  const hollowHeight = bodyHeight - floorThickness
  const pinLength = 8.75
  const bodyWidth = (numPins - 1) * pitch + 4.9
  const startX = -((numPins - 1) * pitch) / 2

  // Keying slot positions (near left and right edges of front wall)
  const keySlotWidth = 0.8
  const keySlotDepth = wallThickness + 0.2
  const keySlotHeight = 3.5
  const keySlotX = bodyWidth / 2 - 1.3

  // Central locking notch width (scales with pin count per JST spec)
  const lockNotchWidth = Math.min(
    bodyWidth - 3.4,
    Math.max(3.0, (numPins - 1) * pitch * 0.4 + 2.2),
  )
  const lockNotchHeight = 2.4

  return (
    <>
      {/* 1. White Nylon Connector Housing */}
      <Translate offset={[0, 0, bodyHeight / 2]}>
        <Colorize color={bodyColor}>
          <Subtract>
            {/* Outer Solid Block */}
            <Cuboid size={[bodyWidth, bodyDepth, bodyHeight]} />

            {/* Inner Socket Cavity (open at top) */}
            <Translate offset={[0, 0, (bodyHeight - hollowHeight) / 2 + 0.1]}>
              <Cuboid
                size={[
                  bodyWidth - wallThickness * 2,
                  bodyDepth - wallThickness * 2,
                  hollowHeight + 0.2,
                ]}
              />
            </Translate>

            {/* Front Central Locking Notch (top of front wall) */}
            <Translate
              offset={[
                0,
                -bodyDepth / 2 + wallThickness / 2,
                bodyHeight / 2 - lockNotchHeight / 2 + 0.1,
              ]}
            >
              <Cuboid
                size={[
                  lockNotchWidth,
                  wallThickness + 0.2,
                  lockNotchHeight + 0.2,
                ]}
              />
            </Translate>

            {/* Left Vertical Keying Guide Slot (front wall) */}
            <Translate
              offset={[
                -keySlotX,
                -bodyDepth / 2 + wallThickness / 2,
                bodyHeight / 2 - keySlotHeight / 2 + 0.1,
              ]}
            >
              <Cuboid
                size={[keySlotWidth, keySlotDepth, keySlotHeight + 0.2]}
              />
            </Translate>

            {/* Right Vertical Keying Guide Slot (front wall) */}
            <Translate
              offset={[
                keySlotX,
                -bodyDepth / 2 + wallThickness / 2,
                bodyHeight / 2 - keySlotHeight / 2 + 0.1,
              ]}
            >
              <Cuboid
                size={[keySlotWidth, keySlotDepth, keySlotHeight + 0.2]}
              />
            </Translate>

            {/* Bottom Stand-off / Venting Slots along front bottom edge */}
            {Array.from({ length: numPins }).map((_, i) => (
              <Translate
                key={`vent_${i}`}
                offset={[
                  startX + i * pitch,
                  -bodyDepth / 2 + 0.3,
                  -bodyHeight / 2 + 0.25,
                ]}
              >
                <Cuboid size={[1.0, 0.8, 0.5]} />
              </Translate>
            ))}
          </Subtract>
        </Colorize>
      </Translate>

      {/* 2. Metal Square Through-Hole Contact Pins (0.64mm square) */}
      {showPins &&
        Array.from({ length: numPins }).map((_, i) => (
          <Colorize key={i} color={pinColor}>
            <Translate offset={[startX + i * pitch, 0, pinLength / 2 - 3.4]}>
              <Cuboid size={[0.64, 0.64, pinLength]} />
            </Translate>
          </Colorize>
        ))}

      {/* 3. PCB Plated Through-Hole Footprint (Using @tscircuit/footprinter) */}
      {showFootprint &&
        (() => {
          try {
            const circuitJson = fp.string(`jst${numPins}_xh`).circuitJson()
            const platedHoles = circuitJson.filter(
              (e): e is PcbPlatedHole => e.type === "pcb_plated_hole",
            )
            return platedHoles.map((hole, i) => (
              <FootprintPlatedHole
                key={`footprint_${i}`}
                hole={hole}
                isPin1={i === 0}
              />
            ))
          } catch {
            return null
          }
        })()}
    </>
  )
}

export default JSTXH2_5mm
