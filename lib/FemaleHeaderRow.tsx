import { FemaleHeader } from "./FemaleHeader"

export const FemaleHeaderRow = ({
  numberOfPins,
  pitch = 2.54,
  legsLength = 3,
  innerDiameter = 0.945,
  rows = 1,
  invert,
}: {
  numberOfPins: number
  pitch?: number
  legsLength?: number
  outerDiameter?: number
  innerDiameter?: number
  rows?: number
  invert?: boolean
}) => {
  const bodyHeight = 5
  const pinsPerRow = Math.ceil(numberOfPins / rows)
  const rowSpacing = 2.54 // Standard spacing between rows
  const xoff = -((pinsPerRow - 1) / 2) * pitch

  // Flip Z for inversion
  const flipZ = (z: number) => (invert ? -z + bodyHeight : z)

  return (
    <>
      {Array.from({ length: numberOfPins }, (_, i) => {
        const row = Math.floor(i / pinsPerRow)
        const col = i % pinsPerRow
        const x = xoff + col * pitch
        const y = -row * rowSpacing

        return (
          <FemaleHeader
            key={i}
            x={x}
            y={y}
            pitch={pitch}
            legsLength={legsLength}
            innerDiameter={innerDiameter}
            flipZ={flipZ}
          />
        )
      })}
    </>
  )
}
