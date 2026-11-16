import {
  createPhysicalLqfp,
  type PhysicalLqfpDimensions,
} from "./utils/PhysicalLqfp"
import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

const LegacyLQFP = ({
  pinCount,
  pitch,
  leadWidth,
  padContactLength,
  bodyWidth,
  bodyLength,
}: {
  pinCount: number
  pitch?: number
  leadWidth?: number
  padContactLength?: number
  bodyWidth?: number
  bodyLength?: number
}) => {
  const sidePinCount = pinCount / 4
  if (sidePinCount !== Math.floor(sidePinCount)) {
    throw new Error(`LQFP pinCount must be divisible by 4, got ${pinCount}`)
  }

  // get default values if not specified
  if (!pitch) pitch = 0.5
  if (!padContactLength) padContactLength = 0.6
  if (!leadWidth) leadWidth = 0.22
  if (!bodyWidth) bodyWidth = pitch * (sidePinCount + 4)
  if (!bodyLength) bodyLength = bodyWidth

  const pinOffsetToCenter = ((sidePinCount - 1) * pitch) / 2
  const fullWidth = bodyWidth + 3.3 * padContactLength
  const fullLength = bodyLength + 3.3 * padContactLength
  const leadHeight = 0.8
  const leadThickness = 0.2
  const bodyDistanceX = (fullWidth - bodyWidth) / 2 + 0.4
  const bodyDistanceY = (fullLength - bodyLength) / 2 + 0.4
  const minBodySide = Math.min(bodyWidth, bodyLength)
  const chamferSize = Math.min(0.7, minBodySide * 0.1)
  const notchRadius = Math.min(1.5 / 2, minBodySide * 0.1)
  const notchInset = Math.min(1.5, minBodySide * 0.25)

  return (
    <>
      {/* Pins on the left side */}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`left-${i}`}
          position={{
            x: -fullWidth / 2 - 0.36,
            y: i * pitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={bodyDistanceX}
          height={leadHeight}
        />
      ))}

      {/* Pins on the right side */}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`right-${i}`}
          rotation={Math.PI}
          position={{
            x: fullWidth / 2 + 0.36,
            y: i * pitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={bodyDistanceX}
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
            y: -fullLength / 2 - 0.36,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={bodyDistanceY}
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
            y: fullLength / 2 + 0.36,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={bodyDistanceY}
          height={leadHeight}
        />
      ))}

      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={1.5}
        heightAboveSurface={0.1}
        taperRatio={0.04}
        chamferSize={chamferSize}
        notchPosition={{
          x: -(bodyWidth / 2 - notchInset),
          y: bodyLength / 2 - notchInset,
          z: 1.5,
        }}
        notchRadius={notchRadius}
      />
    </>
  )
}

/** leadSpanX selects explicit physical dimensions. Existing callers retain
 * their legacy geometry. See standard outline evidence in the fixtures.
 */
export type LQFPProps =
  | Parameters<typeof LegacyLQFP>[0]
  | PhysicalLqfpDimensions
export const LQFP = (props: LQFPProps) =>
  "leadSpanX" in props ? createPhysicalLqfp(props) : LegacyLQFP(props)
export default LQFP
