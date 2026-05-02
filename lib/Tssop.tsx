import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

// TODO use mm to convert width to mm (and accept strings)
export const Tssop = ({
  pinCount,
  leadLength,
  leadWidth,
  pitch,
  bodyWidth,
}: {
  pinCount: number
  pitch: number
  leadWidth: number
  leadLength: number
  bodyWidth: number
}) => {
  const sidePinCount = Math.ceil(pinCount / 2)
  const isSmallTssop = sidePinCount <= 4
  const pinOffsetToCenter = ((sidePinCount - 1) * pitch) / 2
  const bodyLength =
    pitch * Math.max(sidePinCount - 1, 0) + (isSmallTssop ? 1.5 : 1.15)
  const bodyVisualWidth = bodyWidth - (isSmallTssop ? 0.66 : 0.58)
  const leadThickness = 0.15
  const leadHeight = 0.8
  const bodyHeight = 1.22
  const bodyStandoff = 0.24
  const padContactLength = leadLength * 0.5
  const leadReach =
    padContactLength + Math.max(0.22, Math.min(0.4, leadLength * 0.65))
  const leadStartOffset = bodyWidth / 2 + leadLength / 2
  const curveLength = leadReach * 0.1
  const notchInset = Math.min(Math.min(bodyVisualWidth, bodyLength) * 0.18, 1)
  const notchRadius = Math.min(
    Math.min(bodyVisualWidth, bodyLength) * 0.12,
    0.45,
  )

  return (
    <>
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`left-${i}`}
          position={{
            x: -leadStartOffset,
            y: i * pitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={leadReach}
          curveLength={curveLength}
          height={leadHeight}
        />
      ))}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`right-${i}`}
          rotation={Math.PI}
          position={{
            x: leadStartOffset,
            y: i * pitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={leadReach}
          curveLength={curveLength}
          height={leadHeight}
        />
      ))}
      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyVisualWidth}
        length={bodyLength}
        height={bodyHeight}
        notchPosition={{
          x: -(bodyVisualWidth / 2 - notchInset - 0.2),
          y: bodyLength / 2 - notchInset - 0.2,
          z: bodyHeight,
        }}
        notchRadius={notchRadius}
      />
    </>
  )
}
