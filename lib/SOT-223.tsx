import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export const SOT223 = () => {
  const fullWidth = 6.6
  const bodyWidth = 3.5
  const bodyLength = 6.5
  const bodyHeight = 1.7
  const leadWidth = 0.7
  const leftLeadWidth = 3
  const leadThickness = 0.25
  const leadHeight = 0.75
  const padContactLength = 0.5
  const padPitch = 2.3

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
