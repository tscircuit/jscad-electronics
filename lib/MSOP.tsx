import {
  createDualRowGullWing,
  type DualRowGullWingDimensions,
} from "./utils/DualRowGullWing"
import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

// MSOP (mini small outline package) — modeled after Tssop implementation
const LegacyMSOP = ({
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
        notchRadius={0.35}
        heightAboveSurface={0.1}
        taperRatio={0.09}
      />
    </>
  )
}

/** MO-187 MSOP physical outline. leadSpan selects explicit package dimensions;
 * existing callers retain the legacy default outline. See fixture source notes.
 */
export type MSOPProps =
  | Parameters<typeof LegacyMSOP>[0]
  | DualRowGullWingDimensions
export const MSOP = (props: MSOPProps) =>
  "leadSpan" in props ? createDualRowGullWing(props) : LegacyMSOP(props)
