import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export const Tssop20 = ({
  pinCount,
  fullWidth = 6.5,
}: {
  pinCount: number;
  fullWidth?: number;
}) => {
  const sidePinCount = Math.ceil(pinCount / 2)
  const pitch = 0.65  
  
  const fullLength = (sidePinCount + 0.75) * pitch
  const pinOffsetToCenter = ((sidePinCount - 1) * pitch) / 2

  const bodyWidth = 4.5
  const bodyDistance = (fullWidth - bodyWidth) / 2

  return (
    <>
      {/* Pins on the left side */}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`left-${i}`}
          position={{
            x: -fullWidth / 2 - 0.3,
            y: 0,
            z: i * pitch - pinOffsetToCenter,
          }}
          width={0.25}
          thickness={0.15}
          padContactLength={0.6}
          bodyDistance={bodyDistance}
          height={0.8}
        />
      ))}

      {/* Pins on the right side */}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`right-${i}`}
          rotation={Math.PI}
          position={{
            x: fullWidth / 2 + 0.3,
            y: 0,
            z: i * pitch - pinOffsetToCenter,
          }}
          width={0.25}
          thickness={0.15}
          padContactLength={0.6}
          bodyDistance={bodyDistance}
          height={0.8}
        />
      ))}

      <ChipBody
        center={{ x: 0, y: 0.4 / 2, z: 0 }}
        width={bodyWidth + 0.7}
        length={fullLength}
        height={1.2}
      />
    </>
  )
}

export default Tssop20