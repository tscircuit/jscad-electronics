import { Cuboid } from "jscad-fiber"
import { ChipBody } from "./ChipBody"

export const SOT886 = () => {
  const bodyWidth = 1.0
  const bodyLength = 1.45
  const bodyHeight = 0.5
  const terminalWidth = 0.2
  const terminalLength = 0.3
  const terminalThickness = 0.05
  const pitch = 0.5
  const pinsPerSide = 3
  const pinSpan = pitch * (pinsPerSide - 1)

  return (
    <>
      <ChipBody
        center={{ x: 0, y: 0, z: terminalThickness }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
        heightAboveSurface={0}
        color="#1a1a1a"
        taperRatio={0}
        includeNotch={false}
      />

      {[0, 1, 2].map((i) => {
        const y = -pinSpan / 2 + i * pitch
        return (
          <Cuboid
            key={`left-${i}`}
            center={[
              -bodyWidth / 2 + terminalLength / 2,
              y,
              terminalThickness / 2,
            ]}
            size={[terminalLength, terminalWidth, terminalThickness]}
          />
        )
      })}

      {[0, 1, 2].map((i) => {
        const y = -pinSpan / 2 + i * pitch
        return (
          <Cuboid
            key={`right-${i}`}
            center={[
              bodyWidth / 2 - terminalLength / 2,
              y,
              terminalThickness / 2,
            ]}
            size={[terminalLength, terminalWidth, terminalThickness]}
          />
        )
      })}
    </>
  )
}

export default SOT886
