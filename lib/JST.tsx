import {
  Colorize,
  Cuboid,
  Cylinder,
  Rotate,
  Subtract,
  Translate,
} from "jscad-fiber"
import type { PcbPlatedHole, PcbSmtPad } from "circuit-json"
import { FootprintPlatedHole } from "./FootprintPlatedHole"
import { FootprintPad } from "./FootprintPad"

export type JstSeries = "zh" | "sh" | "ph"

interface JstSeriesDims {
  pitch: number
  bodyHeight: number
  bodyDepth: number
  /** extra width added on each side of the outermost pins */
  sideMargin: number
  pinRadius: number
  pinLength: number
  smd: boolean
  holeDiameter: number
  padWidth: number
  padHeight: number
}

const SERIES_DIMS: Record<JstSeries, JstSeriesDims> = {
  // JST ZH 1.5mm through-hole (top entry)
  zh: {
    pitch: 1.5,
    bodyHeight: 6,
    bodyDepth: 3.5,
    sideMargin: 2,
    pinRadius: 0.35,
    pinLength: 6,
    smd: false,
    holeDiameter: 0.73,
    padWidth: 1.03,
    padHeight: 1.73,
  },
  // JST SH 1.0mm surface-mount (top entry)
  sh: {
    pitch: 1.0,
    bodyHeight: 3.9,
    bodyDepth: 4.2,
    sideMargin: 1.9,
    pinRadius: 0.25,
    pinLength: 3.5,
    smd: true,
    holeDiameter: 0,
    padWidth: 0.6,
    padHeight: 1.6,
  },
  // JST PH 2.0mm through-hole (top entry)
  ph: {
    pitch: 2.0,
    bodyHeight: 6.5,
    bodyDepth: 4.5,
    sideMargin: 2.25,
    pinRadius: 0.35,
    pinLength: 6.5,
    smd: false,
    holeDiameter: 0.75,
    padWidth: 1.1,
    padHeight: 1.8,
  },
}

interface JSTProps {
  numPins?: number
  series?: JstSeries
  showPins?: boolean
  showFootprint?: boolean
  bodyColor?: string
  pinColor?: string
}

/**
 * Parametric JST connector (ZH / SH / PH series).
 * ZH and PH are through-hole top-entry, SH is surface-mount top-entry.
 */
export const JST = ({
  numPins = 4,
  series = "ph",
  showPins = true,
  showFootprint = true,
  bodyColor = "#f5f5f5",
  pinColor = "#635959",
}: JSTProps) => {
  const dims = SERIES_DIMS[series]
  const { pitch, bodyHeight, bodyDepth, sideMargin, pinRadius, pinLength } =
    dims
  const wallThickness = 0.5
  const hollowHeight = bodyHeight * 0.6
  const bodyWidth = (numPins - 1) * pitch + sideMargin * 2
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
        Array.from({ length: numPins }).map((_, i) =>
          dims.smd ? (
            // SMD gull-wing contact: short vertical stub + horizontal foot
            <Colorize key={i} color={pinColor}>
              <Cuboid
                size={[dims.padWidth, 0.3, bodyHeight * 0.5]}
                center={[
                  startX + i * pitch,
                  bodyDepth / 2 - 0.15,
                  bodyHeight * 0.25,
                ]}
              />
              <Cuboid
                size={[dims.padWidth, dims.padHeight, 0.2]}
                center={[
                  startX + i * pitch,
                  bodyDepth / 2 + dims.padHeight / 2 - 0.2,
                  0.1,
                ]}
              />
            </Colorize>
          ) : (
            <Colorize key={i} color={pinColor}>
              <Cylinder
                height={pinLength}
                radius={pinRadius}
                center={[startX + i * pitch, 0, 2.5]}
              />
            </Colorize>
          ),
        )}

      {showFootprint &&
        !dims.smd &&
        Array.from({ length: numPins }).map((_, i) => {
          const isPin1 = i === 0
          const hole: PcbPlatedHole = isPin1
            ? {
                type: "pcb_plated_hole",
                pcb_plated_hole_id: `jst${series}_${i}`,
                shape: "circular_hole_with_rect_pad",
                x: startX + i * pitch,
                y: 0,
                hole_diameter: dims.holeDiameter,
                rect_pad_width: dims.padWidth,
                rect_pad_height: dims.padHeight,
                hole_shape: "circle",
                pad_shape: "rect",
                layers: ["top", "bottom"],
                port_hints: [`${i + 1}`],
              }
            : {
                type: "pcb_plated_hole",
                pcb_plated_hole_id: `jst${series}_${i}`,
                shape: "pill",
                x: startX + i * pitch,
                y: 0,
                hole_height: dims.holeDiameter,
                hole_width: dims.holeDiameter,
                outer_height: dims.padHeight,
                outer_width: dims.padWidth,
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

      {showFootprint &&
        dims.smd &&
        Array.from({ length: numPins }).map((_, i) => {
          const pad: PcbSmtPad = {
            type: "pcb_smtpad",
            pcb_smtpad_id: `jst${series}_${i}`,
            shape: "rect",
            x: startX + i * pitch,
            y: bodyDepth / 2 + dims.padHeight / 2 - 0.2,
            width: dims.padWidth,
            height: dims.padHeight,
            layer: "top",
            port_hints: [`${i + 1}`],
          }
          return (
            <FootprintPad key={`footprint_${i}`} pad={pad} isPin1={i === 0} />
          )
        })}
    </>
  )
}

export default JST
