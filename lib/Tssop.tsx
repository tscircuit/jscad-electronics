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
  const sidePinLength = Math.ceil(pinCount / 2)
  const fullLength = (pitch * pinCount) / 2 + leadWidth / 2
  const pinOffsetToCenter = ((sidePinLength - 1) * pitch) / 2
  return (
    <>
      {Array.from({ length: sidePinLength }).map((_, i) => (
        <SmdChipLead
          key={i}
          position={{
            x: -bodyWidth / 2 - 0.9,
            y: i * pitch - pinOffsetToCenter,
            z: 0,
          }}
          width={leadWidth}
          thickness={0.25}
          padContactLength={leadLength}
          bodyDistance={leadLength + 0.4}
          height={0.8}
        />
      ))}
      {Array.from({ length: sidePinLength }).map((_, i) => (
        <SmdChipLead
          key={i}
          rotation={Math.PI}
          position={{
            x: bodyWidth / 2 + 0.9,
            y: i * pitch - pinOffsetToCenter,
            z: 0,
          }}
          width={leadWidth}
          thickness={0.25}
          padContactLength={leadLength}
          bodyDistance={leadLength + 0.4}
          height={0.8}
        />
      ))}
      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={fullLength}
        height={1.5}
      />
    </>
  )
}
