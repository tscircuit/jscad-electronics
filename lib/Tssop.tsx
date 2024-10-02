import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

// TODO use mm to convert width to mm (and accept strings)
export const Tssop = ({
  pinCount,
  fullWidth = 6.4,
}: { pinCount: number; fullWidth?: number }) => {
  const sidePinLength = Math.ceil(pinCount / 2)

  const fullLength = (sidePinLength + 0.75) * 1.27
  const pinOffsetToCenter = ((sidePinLength - 1) * 1.27) / 2

  return (
    <>
      {Array.from({ length: sidePinLength }).map((_, i) => (
        <SmdChipLead
          key={i}
          position={{
            x: -fullWidth / 2,
            y: i * 1.27 - pinOffsetToCenter,
            z: 0,
          }}
          width={0.25}
          thickness={0.15}
          padContactLength={0.6}
          bodyDistance={(6.4 - 4.4) / 2}
          height={0.8}
        />
      ))}
      {Array.from({ length: sidePinLength }).map((_, i) => (
        <SmdChipLead
          key={i}
          rotation={Math.PI}
          position={{ x: fullWidth / 2, y: i * 1.27 - pinOffsetToCenter, z: 0 }}
          width={0.25}
          thickness={0.15}
          padContactLength={0.6}
          bodyDistance={(6.4 - 4.4) / 2}
          height={0.8}
        />
      ))}
      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={fullWidth - 2}
        length={fullLength}
        height={1.5}
      />
    </>
  )
}
