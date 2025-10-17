import { ChipBody } from "./ChipBody"
import type { FC } from "react"
import { Cuboid, Colorize, Union } from "jscad-fiber"

export const SMA: FC = () => {
  // Dimensions from diodes.com SMA.pdf datasheet
  const bodyLength = 4.25 // H
  const bodyWidth = 4.3 // B
  const bodyHeight = 2.14 // C
  const leadWidth = 1.45 // A
  const leadContactLength = 1.14 // G
  const leadThickness = 0.2

  const Lead = ({ position }: { position: "positive" | "negative" }) => {
    const x = position === "positive" ? 1 : -1
    return (
      <Colorize color="#ccc">
        <Union>
          {/* Horizontal part of the lead (pad) */}
          <Cuboid
            size={[leadContactLength, leadWidth, leadThickness]}
            center={{
              x: x * (bodyLength / 2 + leadContactLength / 2),
              y: 0,
              z: leadThickness / 2,
            }}
          />
          {/* Vertical part of the lead */}
          <Cuboid
            size={[leadThickness, leadWidth, bodyHeight * 0.6]}
            center={{
              x: x * (bodyLength / 2 - leadThickness / 2),
              y: 0,
              z: (bodyHeight * 0.6) / 2,
            }}
          />
        </Union>
      </Colorize>
    )
  }

  return (
    <>
      <Lead position="positive" />
      <Lead position="negative" />

      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
      />

      {/* Polarity Marking */}
      <Colorize color="#FFFFFF">
        <Cuboid
          size={[0.4, bodyWidth * 0.9, 0.1]}
          center={{ x: bodyLength / 2 - 0.2, y: 0, z: bodyHeight - 0.05 }}
        />
      </Colorize>
    </>
  )
}

export default SMA
