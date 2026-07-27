import type { PcbSmtPadRect } from "circuit-json"
import { Colorize, Cuboid, RoundedCuboid, Subtract } from "jscad-fiber"
import { FootprintPad } from "./FootprintPad"

export interface JSTSmdProps {
  numPins?: number
  pitch?: number
  bodyWidth?: number
  bodyDepth?: number
  bodyHeight?: number
  signalPadY?: number
  padWidth?: number
  padLength?: number
  mountPadPitchX?: number
  mountPadRowDistance?: number
  mountPadWidth?: number
  mountPadLength?: number
  mountTop?: boolean
  showPins?: boolean
  showFootprint?: boolean
  bodyColor?: string
  pinColor?: string
}

/**
 * Generic parametric surface-mount JST-style wire-to-board header.
 *
 * This represents footprinter's configurable `jst*_smd` family rather than a
 * single JST series. Its signal and hold-down pads are fully parameterized.
 */
export const JSTSmd = ({
  numPins = 2,
  pitch = 2,
  bodyWidth = 8,
  bodyDepth = 5,
  bodyHeight = 3.8,
  signalPadY = 0,
  padWidth = 1,
  padLength = 3,
  mountPadPitchX = 5.4,
  mountPadRowDistance = 2.5,
  mountPadWidth = 1.8,
  mountPadLength = 3,
  mountTop = false,
  showPins = true,
  showFootprint = true,
  bodyColor = "#eee9dc",
  pinColor = "#b7a167",
}: JSTSmdProps) => {
  const pinSpan = (numPins - 1) * pitch
  const resolvedBodyWidth = Math.max(
    bodyWidth,
    pinSpan + padWidth + 1.4,
    mountPadPitchX + mountPadWidth * 0.55,
  )
  const startX = -pinSpan / 2
  const mountPadY =
    mountPadRowDistance === 0
      ? signalPadY
      : signalPadY + (mountTop ? 1 : -1) * mountPadRowDistance
  const bodyCenterY = (signalPadY + mountPadY) / 2
  const openingDirection = mountPadY <= signalPadY ? 1 : -1
  const openingDepth = Math.min(bodyDepth * 0.54, 3)
  const openingCenterY =
    bodyCenterY + openingDirection * (bodyDepth / 2 - openingDepth / 2 + 0.05)

  const signalPads: PcbSmtPadRect[] = Array.from(
    { length: numPins },
    (_, index) => ({
      type: "pcb_smtpad",
      pcb_smtpad_id: `jstsmd_signal_${index}`,
      shape: "rect",
      x: startX + index * pitch,
      y: signalPadY,
      width: padWidth,
      height: padLength,
      layer: "top",
      port_hints: [`${index + 1}`],
    }),
  )
  const mountPads: PcbSmtPadRect[] = [
    -mountPadPitchX / 2,
    mountPadPitchX / 2,
  ].map((x, index) => ({
    type: "pcb_smtpad",
    pcb_smtpad_id: `jstsmd_mount_${index}`,
    shape: "rect",
    x,
    y: mountPadY,
    width: mountPadWidth,
    height: mountPadLength,
    layer: "top",
    port_hints: [`${numPins + index + 1}`],
  }))

  return (
    <>
      <Colorize color={bodyColor}>
        <Subtract>
          <RoundedCuboid
            size={[resolvedBodyWidth, bodyDepth, bodyHeight]}
            center={[0, bodyCenterY, bodyHeight / 2 + 0.2]}
            roundRadius={0.18}
          />
          <Cuboid
            size={[
              resolvedBodyWidth - 1.25,
              openingDepth + 0.2,
              bodyHeight - 1.15,
            ]}
            center={[0, openingCenterY, bodyHeight / 2 + 0.5]}
          />
          <Cuboid
            size={[0.7, 0.5, 0.45]}
            center={[
              -resolvedBodyWidth / 2 + 0.65,
              bodyCenterY + openingDirection * (bodyDepth / 2 - 0.15),
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
              size={[pad.width * 0.72, pad.height, 0.22]}
              center={[pad.x, pad.y, 0.11]}
            />
          ))}
          {signalPads.map((pad, index) => (
            <Cuboid
              key={`contact:${index}`}
              size={[
                Math.max(pad.width * 0.48, 0.25),
                openingDepth * 0.7,
                0.18,
              ]}
              center={[
                pad.x,
                openingCenterY - openingDirection * openingDepth * 0.08,
                bodyHeight * 0.55,
              ]}
            />
          ))}
          {mountPads.map((pad, index) => (
            <Cuboid
              key={`mount-tab:${index}`}
              size={[pad.width, pad.height, 0.32]}
              center={[pad.x, pad.y, 0.16]}
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

export default JSTSmd
