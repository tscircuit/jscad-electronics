import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export const SOD523 = ({ fullWidth = 1.65, fullLength = 0.8 }) => {
  const bodyWidth = 1.25
  const bodyLength = 0.6
  const bodyHeight = 0.6
  const leadWidth = 0.15
  const leadThickness = 0.05
  const leadHeight = 0.25
  const padContactLength = 0.1
  const leadYOffset = leadHeight / 1 - 0.15
  const bodyYOffset = leadHeight / 2 - 0.15

  const bodyDistance = (fullWidth - bodyWidth) / 2

  return (
    <>
      {/* Lead on the left side */}
      <SmdChipLead
        key={1}
        position={{
          x: -fullWidth / 2 + leadWidth / 2,
          y: leadYOffset,
          z: 0,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={bodyDistance}
        height={leadHeight}
      />

      {/* Lead on the right side */}
      <SmdChipLead
        key={2}
        rotation={Math.PI}
        position={{
          x: fullWidth / 2 - leadWidth / 2,
          y: leadYOffset,
          z: 0,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={bodyDistance}
        height={leadHeight}
      />

      {/* Chip Body */}
      <ChipBody
        center={{ x: 0, y: bodyYOffset, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
      />
    </>
  )
}

export default SOD523
