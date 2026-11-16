import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export interface TQFPProps {
  pinCount?: number
  pitch?: number
  leadWidth?: number
  padContactLength?: number
  bodyWidth?: number
  bodyLength?: number
}

export const TQFP = ({
  pinCount = 64,
  pitch,
  leadWidth,
  padContactLength,
  bodyWidth,
  bodyLength,
}: TQFPProps = {}) => {
  const sidePinCount = pinCount / 4
  if (!Number.isInteger(sidePinCount) || sidePinCount < 1) {
    throw new Error(`TQFP pinCount must be divisible by 4, got ${pinCount}`)
  }

  const resolvedPitch = pitch ?? (pinCount === 32 ? 0.8 : 0.5)
  const resolvedLeadWidth =
    leadWidth ?? (pinCount === 32 ? 0.55 : pinCount === 144 ? 0.25 : 0.3)
  const footprintPadLength =
    padContactLength ?? (pinCount === 144 ? 1.6 : 1.475)
  const resolvedBodyWidth = bodyWidth ?? resolvedPitch * (sidePinCount + 4)
  const resolvedBodyLength = bodyLength ?? resolvedBodyWidth

  const pinOffsetToCenter = ((sidePinCount - 1) * resolvedPitch) / 2
  const leadReach = footprintPadLength * 0.5
  const fullWidth = resolvedBodyWidth + 2 * leadReach
  const fullLength = resolvedBodyLength + 2 * leadReach
  const leadHeight = 0.65
  const leadThickness = 0.15
  const bodyDistance = leadReach
  const fullPadContactLength = leadReach * 0.5
  const curveLength = leadReach * 0.18
  const minBodySide = Math.min(resolvedBodyWidth, resolvedBodyLength)
  const chamferSize = Math.min(0.7, minBodySide * 0.1)
  const notchRadius = Math.min(0.6, minBodySide * 0.08)
  const notchInset = Math.min(1.5, minBodySide * 0.22)

  return (
    <>
      {/* Pins on the left side */}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`left-${i}`}
          position={{
            x: -fullWidth / 2,
            y: i * resolvedPitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={resolvedLeadWidth}
          thickness={leadThickness}
          padContactLength={fullPadContactLength}
          bodyDistance={bodyDistance}
          curveLength={curveLength}
          height={leadHeight}
        />
      ))}

      {/* Pins on the right side */}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`right-${i}`}
          rotation={Math.PI}
          position={{
            x: fullWidth / 2,
            y: i * resolvedPitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={resolvedLeadWidth}
          thickness={leadThickness}
          padContactLength={fullPadContactLength}
          bodyDistance={bodyDistance}
          curveLength={curveLength}
          height={leadHeight}
        />
      ))}

      {/* Pins on the bottom side */}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`bottom-${i}`}
          rotation={Math.PI / 2}
          position={{
            x: i * resolvedPitch - pinOffsetToCenter,
            y: -fullLength / 2,
            z: leadThickness / 2,
          }}
          width={resolvedLeadWidth}
          thickness={leadThickness}
          padContactLength={fullPadContactLength}
          bodyDistance={bodyDistance}
          curveLength={curveLength}
          height={leadHeight}
        />
      ))}

      {/* Pins on the top side */}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`top-${i}`}
          rotation={-Math.PI / 2}
          position={{
            x: i * resolvedPitch - pinOffsetToCenter,
            y: fullLength / 2,
            z: leadThickness / 2,
          }}
          width={resolvedLeadWidth}
          thickness={leadThickness}
          padContactLength={fullPadContactLength}
          bodyDistance={bodyDistance}
          curveLength={curveLength}
          height={leadHeight}
        />
      ))}

      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={resolvedBodyWidth}
        length={resolvedBodyLength}
        height={1.2}
        chamferSize={chamferSize}
        taperRatio={0.05}
        notchPosition={{
          x: -(resolvedBodyWidth / 2 - notchInset),
          y: resolvedBodyLength / 2 - notchInset,
          z: 1.2,
        }}
        notchRadius={notchRadius}
      />
    </>
  )
}

export default TQFP
