import type { PcbSmtPadRect } from "circuit-json"
import { Colorize, Cuboid, RoundedCuboid, Subtract } from "jscad-fiber"
import { FootprintPad } from "./FootprintPad"

export interface JSTSH1mmProps {
  numPins?: number
  pitch?: number
  bodyDepth?: number
  bodyHeight?: number
  signalPadY?: number
  padWidth?: number
  padLength?: number
  mountPadY?: number
  mountPadWidth?: number
  mountPadLength?: number
  showPins?: boolean
  showFootprint?: boolean
  bodyColor?: string
  pinColor?: string
}

/**
 * Parametric JST SH-style, top-entry surface-mount header.
 */
export const JSTSH1mm = ({
  numPins = 2,
  pitch = 1,
  bodyDepth = 4.25,
  bodyHeight = 2.9,
  signalPadY = -1.325,
  padWidth = 0.6,
  padLength = 1.55,
  mountPadY = 1.22,
  mountPadWidth = 1.2,
  mountPadLength = 1.8,
  showPins = true,
  showFootprint = true,
  bodyColor = "#eee9d8",
  pinColor = "#b8a062",
}: JSTSH1mmProps) => {
  const pinSpan = (numPins - 1) * pitch
  const bodyWidth = pinSpan + 3
  const startX = -pinSpan / 2
  const mountPadX = pinSpan / 2 + 1.3
  const bodyCenterY = (signalPadY + mountPadY) / 2
  const cavityWidth = Math.max(bodyWidth - 0.95, pitch * 0.8)
  const cavityDepth = Math.max(bodyDepth - 1.05, 1.5)

  const signalPads: PcbSmtPadRect[] = Array.from(
    { length: numPins },
    (_, index) => ({
      type: "pcb_smtpad",
      pcb_smtpad_id: `jstsh_signal_${index}`,
      shape: "rect",
      x: startX + index * pitch,
      y: signalPadY,
      width: padWidth,
      height: padLength,
      layer: "top",
      port_hints: [`${index + 1}`],
    }),
  )
  const mountPads: PcbSmtPadRect[] = [-mountPadX, mountPadX].map(
    (x, index) => ({
      type: "pcb_smtpad",
      pcb_smtpad_id: `jstsh_mount_${index}`,
      shape: "rect",
      x,
      y: mountPadY,
      width: mountPadWidth,
      height: mountPadLength,
      layer: "top",
      port_hints: [`${numPins + index + 1}`],
    }),
  )

  return (
    <>
      <Colorize color={bodyColor}>
        <Subtract>
          <RoundedCuboid
            size={[bodyWidth, bodyDepth, bodyHeight]}
            center={[0, bodyCenterY, bodyHeight / 2 + 0.16]}
            roundRadius={0.12}
          />
          <Cuboid
            size={[cavityWidth, cavityDepth, bodyHeight * 0.62]}
            center={[0, bodyCenterY, bodyHeight * 0.76 + 0.16]}
          />
          <Cuboid
            size={[0.45, 0.5, 0.35]}
            center={[
              -bodyWidth / 2 + 0.45,
              bodyCenterY - bodyDepth / 2,
              bodyHeight - 0.05,
            ]}
          />
        </Subtract>
      </Colorize>

      {showPins && (
        <Colorize color={pinColor}>
          {signalPads.map((pad, index) => (
            <Cuboid
              key={`signal-lead:${index}`}
              size={[
                Math.max(pad.width * 0.72, 0.24),
                pad.height + bodyDepth * 0.32,
                0.18,
              ]}
              center={[pad.x, signalPadY + bodyDepth * 0.16, 0.13]}
            />
          ))}
          {signalPads.map((pad, index) => (
            <Cuboid
              key={`contact:${index}`}
              size={[Math.max(pad.width * 0.55, 0.2), cavityDepth * 0.68, 0.15]}
              center={[
                pad.x,
                bodyCenterY - cavityDepth * 0.04,
                bodyHeight * 0.58,
              ]}
            />
          ))}
          {mountPads.map((pad, index) => (
            <Cuboid
              key={`mount-tab:${index}`}
              size={[pad.width, pad.height, 0.28]}
              center={[pad.x, pad.y, 0.14]}
            />
          ))}
        </Colorize>
      )}

      {showFootprint &&
        [...signalPads, ...mountPads].map((pad, index) => (
          <FootprintPad
            key={`footprint:${index}`}
            pad={pad}
            isPin1={index === 0}
          />
        ))}
    </>
  )
}

export default JSTSH1mm
