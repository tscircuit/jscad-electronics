import { fp } from "@tscircuit/footprinter";
import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

// TODO use mm to convert width to mm (and accept strings)
export const Tssop = ({
  pinCount,
  fpJson,
  fullWidth = 6.4,
}: { pinCount?: number; fullWidth?: number; fpJson: any }) => {

  const sidePinLength = Math.ceil(fpJson.num_pins / 2)
  const fullLength = fpJson.p * fpJson.num_pins / 2 + (fpJson.pw / 2)
  const pinOffsetToCenter = ((sidePinLength - 1) * fpJson.p) / 2
  return (
    <>
      {Array.from({ length: sidePinLength }).map((_, i) => (
        <SmdChipLead
          key={i}
          position={{
            x: -fpJson.w / 2 - fpJson.pl * 2,
            y: i * fpJson.p - pinOffsetToCenter,
            z: 0,
          }}
          width={fpJson.pw}
          thickness={0.25}
          padContactLength={fpJson.pl}
          bodyDistance={fpJson.pl + 0.6}
          height={0.8}
        />
      ))}
      {Array.from({ length: sidePinLength }).map((_, i) => (
        <SmdChipLead
          key={i}
          rotation={Math.PI}
          position={{
            x: fpJson.w / 2 + fpJson.pl * 2,
            y: i * fpJson.p - pinOffsetToCenter,
            z: 0
          }}
          width={fpJson.pw}
          thickness={0.25}
          padContactLength={fpJson.pl}
          bodyDistance={fpJson.pl + 0.6}
          height={0.8}
        />
      ))}
      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={fpJson.w}
        length={fullLength}
        height={1.5}
      />
    </>
  )
}
