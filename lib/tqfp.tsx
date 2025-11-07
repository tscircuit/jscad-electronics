import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export const TQFP = () => {
  const pinCount = 64
  const pitch = 0.5
  const leadWidth = 0.2
  const padContactLength = 0.45
  const bodyWidth = 9
  const sidePinCount = pinCount / 4
  const bodyLength = bodyWidth
  const pinOffsetToCenter = ((sidePinCount - 1) * pitch) / 2
  const fullLength = bodyLength + 2 * padContactLength + 0.6
  const fullWidth = fullLength
  const leadHeight = 0.8
  const leadThickness = 0.25
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
        height={1.2}
        chamferSize={0.6}
        taperRatio={0.05}
        notchPosition={{ x: 3.5, y: 3.5, z: 1.2 }}
        notchRadius={1.2 / 2}
      />
    </>
  )
}

export default TQFP
