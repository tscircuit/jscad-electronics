import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export const SOD123 = ({ fullWidth = 3.8, fullLength = 1.6 }) => {
  const bodyWidth = 2.9
  const bodyLength = 1.3
  const bodyHeight = 1.1
  const leadWidth = 0.8
  const leadThickness = 0.15
  const leadHeight = 0.5
  const padContactLength = 0.4
  const leadYOffset = leadHeight / 1 - 0.4
  const bodyYOffset = leadHeight / 2 - 0.4

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

export default SOD123
