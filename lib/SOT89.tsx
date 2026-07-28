import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

/**
 * SOT-89 package: 3 gull-wing leads on one side, wide tab on the other.
 */
export const SOT89 = () => {
  const fullWidth = 4.2
  const bodyWidth = 2.6
  const bodyLength = 4.5
  const bodyHeight = 1.5
  const leadWidth = 0.5
  const tabLeadWidth = 1.9
  const leadThickness = 0.2
  const leadHeight = 0.75
  const padContactLength = 0.5
  const padPitch = 1.5

  const extendedBodyDistance = fullWidth - bodyWidth

  return (
    <>
      {/* Tab on the right side */}
      <SmdChipLead
        key={4}
        rotation={Math.PI}
        position={{
          x: fullWidth / 2 + extendedBodyDistance / 4,
          y: 0,
          z: leadThickness / 2,
        }}
        width={tabLeadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={extendedBodyDistance}
        height={leadHeight}
      />

      {/* 3 leads on the left side */}
      {[-padPitch, 0, padPitch].map((y, i) => (
        <SmdChipLead
          key={i}
          position={{
            x: -fullWidth / 2 - extendedBodyDistance / 4,
            y,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={extendedBodyDistance}
          height={leadHeight}
        />
      ))}

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

export default SOT89
