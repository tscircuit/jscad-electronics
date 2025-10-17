import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"
import type { FC } from "react"

interface SMAProps {
  fullWidth?: number
  fullLength?: number
}

export const SMA: FC<SMAProps> = ({ fullWidth = 5.6, fullLength = 2.8 }) => {
  const bodyWidth = 4.3
  const bodyLength = 2.6
  const bodyHeight = 2.2
  const leadWidth = 1.5
  const leadThickness = 0.2
  const leadHeight = 1.0
  const padContactLength = 0.8
  const padThickness = leadThickness / 2

  const bodyDistance = (fullWidth - bodyWidth) / 2

  return (
    <>
      {/* Lead on the left side */}
      <SmdChipLead
        key={1}
        position={{
          x: -fullWidth / 2 + leadWidth / 2,
          y: 0,
          z: padThickness,
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
          y: 0,
          z: padThickness,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={bodyDistance}
        height={leadHeight}
      />

      {/* Chip Body */}
      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
      />
    </>
  )
}

export default SMA
