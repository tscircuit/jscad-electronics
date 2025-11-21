import { Colorize, Cuboid, Hull, Translate, Union } from "jscad-fiber"
import { ChipBody } from "./ChipBody"

export const SOD323FL = () => {
  const fullWidth = 1.775
  const bodyLength = 1.25
  const bodyHeight = 0.725

  const padWidth = 0.325
  const padLength = 0.4
  const padThickness = 0.13

  const leftPadCenterX = -fullWidth / 2 - padLength / 2 + 0.04
  const rightPadCenterX = fullWidth / 2 + padLength / 2 - 0.04

  const taperOffset = 0.2

  return (
    <>
      {/* Left pad */}
      <Cuboid
        color="#ccc"
        size={[padLength, padWidth, padThickness]}
        center={[leftPadCenterX, 0, padThickness / 2]}
      />

      {/* Right pad */}
      <Cuboid
        color="#ccc"
        size={[padLength, padWidth, padThickness]}
        center={[rightPadCenterX, 0, padThickness / 2]}
      />

      {/* Body */}
      <Colorize color="#222">
        <ChipBody
          width={fullWidth}
          length={bodyLength}
          height={bodyHeight}
          center={{ x: 0, y: 0, z: 0 }}
          heightAboveSurface={0}
          straightHeightRatio={0.7}
          taperRatio={0.06}
          includeNotch={false}
        />
      </Colorize>

      {/* Grey polarity/top strip */}
      <Cuboid
        color="#777"
        size={[fullWidth / 3, bodyLength - 0.05, 0.02]}
        center={[leftPadCenterX + fullWidth / 4.4 + taperOffset, 0, bodyHeight]}
      />
    </>
  )
}

export default SOD323FL
