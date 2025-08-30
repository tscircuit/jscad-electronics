import { Cuboid } from "jscad-fiber"
import { ChipBody } from "./ChipBody"

export type SOD523Props = {
  fullWidth?: number
  fullLength?: number
}

export const SOD523 = ({ fullWidth = 1.6, fullLength = 0.8 }: SOD523Props) => {
  const bodyWidthNominal = 1.2
  const bodyLengthNominal = 0.7
  const bodyHeight = 0.6

  const padWidth = 0.3
  const padLength = 0.2
  const padThickness = 0.12

  const maxBodyWidth = Math.max(0, fullWidth - 2 * padLength)
  const bodyWidth = Math.min(bodyWidthNominal, maxBodyWidth)
  const bodyLength = Math.min(bodyLengthNominal, fullLength)

  const leftPadCenterX = -fullWidth / 2 + padLength / 2
  const rightPadCenterX = fullWidth / 2 - padLength / 2

  return (
    <>
      {/* Pads */}
      <Cuboid
        color="#ccc"
        size={[padLength, padWidth, padThickness]}
        center={[leftPadCenterX, 0, padThickness / 2]}
      />
      <Cuboid
        color="#ccc"
        size={[padLength, padWidth, padThickness]}
        center={[rightPadCenterX, 0, padThickness / 2]}
      />

      {/* Body */}
      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
      />
    </>
  )
}

export default SOD523
