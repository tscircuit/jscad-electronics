import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"
import type { FC } from "react"
import { Cuboid, Colorize } from "jscad-fiber"

export const SMA: FC = () => {
  // Dimensions from diodes.com SMA.pdf datasheet
  const bodyLength = 4.25 // H
  const bodyWidth = 4.3 // B
  const bodyHeight = 2.14 // C
  const overallLength = 5.1 // D
  const leadWidth = 1.45 // A
  const leadLength = (overallLength - bodyLength) / 2

  return (
    <>
      <SmdChipLead
        key={1}
        position={{
          x: -bodyLength / 2 - leadLength / 2,
          y: 0,
          z: 0.1,
        }}
        width={leadWidth}
        thickness={0.2}
        padContactLength={leadLength}
        bodyDistance={0}
        height={bodyHeight / 2}
      />
      <SmdChipLead
        key={2}
        rotation={Math.PI}
        position={{
          x: bodyLength / 2 + leadLength / 2,
          y: 0,
          z: 0.1,
        }}
        width={leadWidth}
        thickness={0.2}
        padContactLength={leadLength}
        bodyDistance={0}
        height={bodyHeight / 2}
      />

      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
      />

      {/* Polarity Marking */}
      <Colorize color="#FFFFFF">
        <Cuboid
          size={[bodyWidth * 0.9, 0.4, 0.1]}
          center={{ x: 0, y: bodyLength / 2 - 0.2, z: bodyHeight - 0.05 }}
        />
      </Colorize>
    </>
  )
}

export default SMA