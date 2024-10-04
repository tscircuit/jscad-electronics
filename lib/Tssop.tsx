import { fp } from "@tscircuit/footprinter"
import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

// TODO use mm to convert width to mm (and accept strings)
export const Tssop = ({
  pinCount,
  pl,
  pw,
  p,
  bodyWidth,
}: {
  pinCount: number
  p: number
  pw: number
  pl: number
  bodyWidth: number
}) => {
  const sidePinLength = Math.ceil(pinCount / 2)
  const fullLength = (p * pinCount) / 2 + pw / 2
  const pinOffsetToCenter = ((sidePinLength - 1) * p) / 2
  return (
    <>
      {Array.from({ length: sidePinLength }).map((_, i) => (
        <SmdChipLead
          key={i}
          position={{
            x: -bodyWidth / 2 - pl * 2,
            y: i * p - pinOffsetToCenter,
            z: 0,
          }}
          width={pw}
          thickness={0.25}
          padContactLength={pl}
          bodyDistance={pl + 0.6}
          height={0.8}
        />
      ))}
      {Array.from({ length: sidePinLength }).map((_, i) => (
        <SmdChipLead
          key={i}
          rotation={Math.PI}
          position={{
            x: bodyWidth / 2 + pl * 2,
            y: i * p - pinOffsetToCenter,
            z: 0,
          }}
          width={pw}
          thickness={0.25}
          padContactLength={pl}
          bodyDistance={pl + 0.6}
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
