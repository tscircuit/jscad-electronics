import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export const QFP = ({
  pinCount,
  pitch,
  leadWidth,
  padContactLength,
  bodyWidth,
}: {
  pinCount: number
  pitch?: number
  leadWidth?: number
  padContactLength?: number
  bodyWidth?: number
}) => {
  const sidePinCount = pinCount / 4

  // get default values if not specified
  if (!pitch) pitch = getPitch(pinCount, bodyWidth)
  if (!padContactLength) padContactLength = getPadContactLength(pinCount)
  if (!leadWidth) leadWidth = getLeadWidth(pinCount, bodyWidth)
  if (!bodyWidth) bodyWidth = pitch * (sidePinCount + 4)

  const bodyLength = bodyWidth
  const pinOffsetToCenter = ((sidePinCount - 1) * pitch) / 2
  const fullLength = bodyLength + 2 * padContactLength
  const fullWidth = fullLength
  const leadHeight = 0.8
  const leadThickness = 0.15
  const bodyDistance = (fullWidth - bodyWidth) / 2 + 0.2

  return (
    <>
      {/* Pins on the left side */}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`left-${i}`}
          position={{
            x: -fullWidth / 2,
            y: i * pitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={bodyDistance}
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
            y: i * pitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={bodyDistance}
          height={leadHeight}
        />
      ))}

      {/* Pins on the bottom side */}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`bottom-${i}`}
          rotation={Math.PI / 2}
          position={{
            x: i * pitch - pinOffsetToCenter,
            y: -fullLength / 2,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={bodyDistance}
          height={leadHeight}
        />
      ))}

      {/* Pins on the top side */}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`top-${i}`}
          rotation={-Math.PI / 2}
          position={{
            x: i * pitch - pinOffsetToCenter,
            y: fullLength / 2,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={bodyDistance}
          height={leadHeight}
        />
      ))}

      <ChipBody
        center={{ x: 0, y: 0, z: leadThickness / 2 }}
        width={bodyWidth}
        length={bodyLength}
        height={1.5}
        taperRatio={0.03}
        chamferSize={1}
        notchPosition={{
          x: bodyLength / 2 - 1.5,
          y: bodyWidth / 2 - 1.5,
          z: 1.5,
        }}
      />
    </>
  )
}
// Helper functions to determine default values based on pinCount and width of QFP as footprinter repo
const getPitch = (pinCount: number, width?: number): number => {
  switch (pinCount) {
    case 44:
    case 64:
      return 0.8
    case 52:
      return width === 14 ? 1 : 0.65
    case 208:
      return 0.5
    default:
      return 0.5
  }
}

const getPadContactLength = (pinCount: number): number => {
  switch (pinCount) {
    case 44:
    case 52:
    case 64:
      return 2.25
    case 208:
      return 1.65
    default:
      return 1
  }
}

const getLeadWidth = (pinCount: number, width?: number): number => {
  switch (pinCount) {
    case 44:
    case 64:
      return 0.5
    case 52:
      return width === 14 ? 0.45 : 0.55
    case 208:
      return 0.3
    default:
      return 0.25
  }
}
export default QFP
