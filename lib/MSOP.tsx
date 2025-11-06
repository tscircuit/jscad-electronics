import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

// MSOP (mini small outline package) — modeled after Tssop implementation
export const MSOP = ({
  pinCount,
  padContactLength = 0.4,
  leadWidth = 0.2,
  pitch = 0.65,
  bodyWidth = 3.0,
}: {
  pinCount: number
  pitch?: number
  leadWidth?: number
  padContactLength?: number
  bodyWidth?: number
}) => {
  const sidePinCount = Math.ceil(pinCount / 2)
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
          height={0.6}
        />
      ))}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={i}
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
          height={0.6}
        />
      ))}
      <ChipBody
        center={{ x: 0, y: 0, z: leadThickness / 2 }}
        width={bodyWidth}
        length={bodyWidth}
        height={1.1}
        notchPosition={{ x: bodyWidth / 2 - 1, y: bodyWidth / 2 - 1, z: 1.2 }}
        notchRadius={0.35}
        heightAboveSurface={0.1}
        taperRatio={0.09}
      />
    </>
  )
}
