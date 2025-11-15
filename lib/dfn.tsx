import { Cuboid } from "jscad-fiber"
import { ChipBody } from "./ChipBody"
export const DFN = ({
  num_pins,
  bodyWidth = 5.3,
  bodyLength = 5.3,
  bodyThickness = 1,
  thermalPadSize,
  // For a body length of 5 the typical pad width/length are 0.6 and 1.
  // Scale those values proportionally when `bodyLength` changes.
  padWidth = (bodyLength / 5.3) * 0.6,
  padLength = (bodyLength / 5.3) * 1,
  pitch = 0.5,
  thermalPadThickness = 0.2,
}: {
  num_pins: number
  bodyWidth?: number
  bodyLength?: number
  bodyThickness?: number
  thermalPadSize?: {
    width: number
    length: number
  }
  padWidth?: number
  padLength?: number
  pitch?: number
  thermalPadThickness?: number
}) => {
  // DFN packages have pads on two opposite sides (left & right).
  // Distribute pins evenly between the two sides.
  const pinPositions: Array<{
    pinNumber: number
    x: number
    y: number
    padSizeX: number // size across the package X axis (pad width)
    padSizeY: number // size along the package Y axis (pad length)
  }> = []

  const pinsPerSide = Math.floor(num_pins / 2)
  // pinSpan = distance between first and last pin on a side (along Y)
  const pinSpan = pitch * (pinsPerSide - 1)

  for (let i = 0; i < num_pins; i++) {
    const side = i < pinsPerSide ? "left" : "right"
    const indexOnSide = i % pinsPerSide
    const y = pinSpan / 2 - indexOnSide * pitch

    // Pads on DFN are typically oriented vertically (long edge along Y)
    const padSizeX = padLength // X dimension of pad (short side)
    const padSizeY = padWidth // Y dimension of pad (long side)

    // x position: place pad inside the body so its outer edge touches the
    // package edge. Pad center should be half the pad X size away from edge.
    const x =
      side === "left"
        ? -bodyWidth / 2 + padSizeX / 2
        : bodyWidth / 2 - padSizeX / 2

    const pinNumber = i + 1
    pinPositions.push({ pinNumber, x, y, padSizeX, padSizeY })
  }

  return (
    <>
      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyThickness}
        heightAboveSurface={0}
        color="grey"
        chamferSize={0.2}
        taperRatio={0}
        notchPosition={{
          x: -(bodyWidth / 2 - padLength),
          y: bodyLength / 2 - padLength,
          z: bodyThickness,
        }}
      />
      {pinPositions.map((p, i) => (
        <Cuboid
          key={i}
          center={[p.x, p.y, thermalPadThickness / 2]}
          size={[p.padSizeX, p.padSizeY, thermalPadThickness]}
        />
      ))}
      {thermalPadSize?.length !== undefined &&
        thermalPadSize?.width !== undefined && (
          <Cuboid
            center={[0, 0, thermalPadThickness / 2]}
            size={[
              thermalPadSize.width,
              thermalPadSize.length,
              thermalPadThickness,
            ]}
          />
        )}
    </>
  )
}

export default DFN
