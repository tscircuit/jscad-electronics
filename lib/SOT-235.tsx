import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export const SOT235 = () => {
  const fullWidth = 2.8
  const bodyWidth = 1.6
  const bodyLength = 2.9
  const bodyHeight = 1.2
  const leadWidth = 0.4
  const leadThickness = 0.15
  const leadHeight = 0.45
  const padContactLength = 0.25
  const padPitch = 0.95

  // Increase the bodyDistance to extend leads further out
  const extendedBodyDistance = fullWidth - bodyWidth

  return (
    <>
      {/* Leads on the left side (pins 1, 2, 3) */}
      <SmdChipLead
        key={1}
        position={{
          x: -fullWidth / 2 - extendedBodyDistance / 4,
          y: 0.95,
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
        key={3}
        position={{
          x: -fullWidth / 2 - extendedBodyDistance / 4,
          y: -0.95,
          z: leadThickness / 2,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={extendedBodyDistance}
        height={leadHeight}
      />

      {/* Leads on the right side (pins 4 and 5) */}
      <SmdChipLead
        key={4}
        rotation={Math.PI}
        position={{
          x: fullWidth / 2 + extendedBodyDistance / 4,
          y: -0.95,
          z: leadThickness / 2,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={extendedBodyDistance}
        height={leadHeight}
      />
      <SmdChipLead
        key={5}
        rotation={Math.PI}
        position={{
          x: fullWidth / 2 + extendedBodyDistance / 4,
          y: 0.95,
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
        straightHeightRatio={0.45}
        heightAboveSurface={0.05}
      />
    </>
  )
}

export default SOT235
