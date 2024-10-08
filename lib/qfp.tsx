import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export const QFP = ({
  pinCount,
}: {
  pinCount: number
}) => {
  const sidePinCount = pinCount / 4
  const pinSpacing = 0.5
  const fullWidth = pinSpacing * sidePinCount + 4
  const fullLength = fullWidth
  const pinOffsetToCenter = ((sidePinCount - 1) * pinSpacing) / 2

  const bodyWidth = fullWidth - 2
  const bodyLength = fullLength - 2
  const leadHeight = 0.8
  const leadWidth = 0.25
  const leadThickness = 0.15
  const padContactLength = 0.6
  const bodyDistance = (fullWidth - bodyWidth) / 2

  return (
    <>
      {/* Pins on the left side */}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`left-${i}`}
          position={{
            x: -fullWidth / 2,
            y: i * pinSpacing - pinOffsetToCenter,
            z: 0,
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
            y: i * pinSpacing - pinOffsetToCenter,
            z: 0,
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
            x: i * pinSpacing - pinOffsetToCenter,
            y: -fullLength / 2,
            z: 0,
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
            x: i * pinSpacing - pinOffsetToCenter,
            y: fullLength / 2,
            z: 0,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={bodyDistance}
          height={leadHeight}
        />
      ))}

      <ChipBody
        center={{ x: 0, y: 0, z: leadHeight / 2 }}
        width={bodyWidth}
        length={bodyLength}
        height={1.5}
      />
    </>
  )
}

export default QFP
