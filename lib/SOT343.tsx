import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

/**
 * SOT-343 package: 4 gull-wing leads, 2 per side.
 */
export const SOT343 = () => {
  const fullWidth = 3.2
  const bodyWidth = 1.9
  const bodyLength = 2.1
  const bodyHeight = 1.1
  const leadWidth = 0.4
  const leadThickness = 0.15
  const leadHeight = 0.55
  const padContactLength = 0.4
  const padPitch = 1.3

  const bodyDistance = (fullWidth - bodyWidth) / 2

  return (
    <>
      {/* 2 leads on the left side */}
      {[-padPitch / 2, padPitch / 2].map((y, i) => (
        <SmdChipLead
          key={`l${i}`}
          position={{
            x: -fullWidth / 2 + leadWidth / 2,
            y,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={bodyDistance}
          height={leadHeight}
        />
      ))}

      {/* 2 leads on the right side */}
      {[-padPitch / 2, padPitch / 2].map((y, i) => (
        <SmdChipLead
          key={`r${i}`}
          rotation={Math.PI}
          position={{
            x: fullWidth / 2 - leadWidth / 2,
            y,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={bodyDistance}
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
      />
    </>
  )
}

export default SOT343
