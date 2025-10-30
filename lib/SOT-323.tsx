import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export const SOT323 = () => {
  const fullWidth = 2.1
  const bodyWidth = 1.25
  const bodyLength = 2.0
  const bodyHeight = 0.9
  const leadWidth = 0.3
  const leadThickness = 0.18
  const leadHeight = 0.5
  const padContactLength = 0.2
  const padPitch = 0.65

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
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={extendedBodyDistance}
        height={leadHeight}
      />

      {/* Lead on the left side (pin 3) */}
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
        straightHeightRatio={0.7}
        heightAboveSurface={0.05}
      />
    </>
  )
}

export default SOT323
