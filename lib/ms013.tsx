import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export const MS013 = ({
  pinCount,
  padContactLength = 0.6,
  leadWidth = 0.41,
  pitch = 1.27,
}: {
  pinCount: number
  pitch?: number
  leadWidth?: number
  padContactLength?: number
}) => {
  if (pinCount % 2 !== 0) {
    throw new Error("MS013 pinCount must be even")
  }
  const sidePinCount = pinCount / 2
  const bodyWidth = 7.5
  const bodyLength = 10.3
  const pinOffsetToCenter = ((sidePinCount - 1) * pitch) / 2
  const leadThickness = 0.2

  return (
    <>
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={i}
          position={{
            x: -bodyWidth / 2 - padContactLength - 0.3,
            y: i * pitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={padContactLength + 0.4}
          height={0.85}
        />
      ))}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`right-${i}`}
          rotation={Math.PI}
          position={{
            x: bodyWidth / 2 + padContactLength + 0.3,
            y: i * pitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={padContactLength + 0.4}
          height={0.85}
        />
      ))}
      <ChipBody
        center={{ x: 0, y: 0, z: leadThickness / 2 }}
        width={bodyWidth}
        length={bodyLength}
        height={1.1}
        notchPosition={{
          x: -bodyWidth / 2 + 0.5,
          y: bodyLength / 2 - 0.5,
          z: 1.1,
        }}
        heightAboveSurface={0.17}
        taperRatio={0.05}
      />
    </>
  )
}
