import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export interface SOT223Props {
  /** Pad-to-pad span across the leads (X). */
  fullWidth?: number
  /** X extent of the moulded body. */
  bodyWidth?: number
  /** Y extent of the moulded body. */
  bodyLength?: number
  bodyHeight?: number
  /** Y width of the three signal leads. */
  leadWidth?: number
  /** Y width of the single wide tab lead on the opposite side. */
  tabLeadWidth?: number
  /** Y pitch of the signal leads. */
  padPitch?: number
  /** How high the lead rises from the pad to the body face. */
  leadHeight?: number
}

/**
 * SOT-223 and its smaller relative SOT-89: three leads one side, one wide tab
 * lead the other. Same construction, different dimensions, so the dimensions
 * are props — SOT-89's body is 4.5 x 2.5 x 1.5, barely a third of the volume.
 */
export const SOT223 = ({
  fullWidth = 6.6,
  bodyWidth = 3.5,
  bodyLength = 6.5,
  bodyHeight = 1.7,
  leadWidth = 0.7,
  tabLeadWidth = 3,
  padPitch = 2.3,
  leadHeight = 0.75,
}: SOT223Props = {}) => {
  const leftLeadWidth = tabLeadWidth
  const leadThickness = 0.25
  const padContactLength = 0.5

  // Increase the bodyDistance to extend leads further out
  const extendedBodyDistance = fullWidth - bodyWidth

  return (
    <>
      {/* Leads on the right side (pin 1) */}
      <SmdChipLead
        key={4}
        rotation={Math.PI}
        position={{
          x: fullWidth / 2 + extendedBodyDistance / 4,
          y: 0,
          z: leadThickness / 2,
        }}
        width={leftLeadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={extendedBodyDistance}
        height={leadHeight}
      />

      {/* Lead on the left side (pin 3) */}
      <SmdChipLead
        key={3}
        position={{
          x: -fullWidth / 2 - extendedBodyDistance / 4,
          y: 0,
          z: leadThickness / 2,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={extendedBodyDistance}
        height={leadHeight}
      />
      <SmdChipLead
        key={1}
        position={{
          x: -fullWidth / 2 - extendedBodyDistance / 4,
          y: -padPitch,
          z: leadThickness / 2,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={extendedBodyDistance}
        height={leadHeight}
      />
      <SmdChipLead
        key={2}
        position={{
          x: -fullWidth / 2 - extendedBodyDistance / 4,
          y: padPitch,
          z: leadThickness / 2,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={extendedBodyDistance}
        height={leadHeight}
      />
      {/* Chip Body */}
      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
        includeNotch={false}
        taperRatio={0.06}
        straightHeightRatio={0.45}
      />
    </>
  )
}

export default SOT223
