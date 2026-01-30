import { Pin } from "./Pin"

export const PinRow = ({
  numberOfPins,
  pitch = 2.54,
  longSidePinLength = 6,
  invert,
  faceup,
  rows = 1,
  smd,
  rightangle,
}: {
  numberOfPins: number
  pitch?: number
  longSidePinLength?: number
  invert?: boolean
  faceup?: boolean
  rows?: number
  smd?: boolean
  rightangle?: boolean
}) => {
  const pinThickness = 0.63
  const bodyHeight = 2
  const pinsPerRow = Math.ceil(numberOfPins / rows)
  const rowSpacing = 2.54 // Standard spacing between rows
  const shortSidePinLength = 3
  const xoff = -((pinsPerRow - 1) / 2) * pitch

  const zOffset = !smd && !rightangle ? -bodyHeight - 1.6 : 0
  // Flip Z coordinates if invert is true
  const flipZ = (z: number) =>
    (invert || faceup ? -z + bodyHeight : z) + zOffset

  return (
    <>
      {Array.from({ length: numberOfPins }, (_, i) => {
        const row = Math.floor(i / pinsPerRow)
        const col = i % pinsPerRow
        const x = xoff + col * pitch
        const y = -row * rowSpacing

        return (
          <Pin
            key={i}
            x={x}
            y={y}
            pinThickness={pinThickness}
            shortSidePinLength={shortSidePinLength}
            longSidePinLength={longSidePinLength}
            bodyHeight={bodyHeight}
            flipZ={flipZ}
            faceup={faceup}
            smd={smd}
            rightangle={rightangle}
          />
        )
      })}
    </>
  )
}
