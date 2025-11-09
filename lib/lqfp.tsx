import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export const LQFP = ({
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
  if (sidePinCount !== Math.floor(sidePinCount)) {
    throw new Error(`LQFP pinCount must be divisible by 4, got ${pinCount}`)
  }

  // get default values if not specified
  if (!pitch) pitch = 0.5
  if (!padContactLength) padContactLength = 0.6
  if (!leadWidth) leadWidth = 0.22
  if (!bodyWidth) bodyWidth = pitch * (sidePinCount + 4)

  const bodyLength = bodyWidth
  const pinOffsetToCenter = ((sidePinCount - 1) * pitch) / 2
  const fullLength = bodyLength + 3.3 * padContactLength
  const fullWidth = fullLength
  const leadHeight = 0.8
  const leadThickness = 0.2
  const bodyDistance = (fullWidth - bodyWidth) / 2 + 0.4

  return (
    <>
      {/* Pins on the left side */}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`left-${i}`}
          position={{
            x: -fullWidth / 2 - 0.36,
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
            x: fullWidth / 2 + 0.36,
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
            y: -fullLength / 2 - 0.36,
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
            y: fullLength / 2 + 0.36,
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
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={1.5}
        heightAboveSurface={0.1}
        taperRatio={0.04}
        chamferSize={0.7}
        notchPosition={{
          x: bodyLength / 2 - 1.5,
          y: bodyLength / 2 - 1.5,
          z: 1.5,
        }}
        notchRadius={1.5 / 2}
      />
    </>
  )
}

export default LQFP
