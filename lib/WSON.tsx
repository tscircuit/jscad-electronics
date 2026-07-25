import { Cuboid, Cylinder, RoundedCuboid } from "jscad-fiber"

export interface WSONProps {
  pitch?: number
  rowSpan?: number
  padLength?: number
  padWidth?: number
  exposedPad?: boolean
  exposedPadWidth?: number
  exposedPadHeight?: number
  bodyWidth?: number
  bodyLength?: number
  bodyHeight?: number
}

export const WSON = ({
  pitch = 0.5,
  rowSpan = 3.015,
  padLength = 0.6,
  padWidth = 0.28,
  exposedPad = true,
  exposedPadWidth = 1.7,
  exposedPadHeight = 0.3,
  bodyWidth = 2,
  bodyLength = 3,
  bodyHeight = 0.75,
}: WSONProps) => {
  const contactHeight = 0.05
  const startX = (-3 * pitch) / 2
  const cornerRadius = Math.min(0.1, bodyWidth / 8, bodyLength / 8)

  return (
    <>
      {Array.from({ length: 4 }, (_, index) => {
        const x = startX + index * pitch
        return [-1, 1].map((direction) => (
          <Cuboid
            key={`${index}:${direction}`}
            color="#c8a84e"
            center={[x, direction * (rowSpan / 2), contactHeight / 2]}
            size={[padWidth, padLength, contactHeight]}
          />
        ))
      })}
      {exposedPad && (
        <Cuboid
          color="#c8a84e"
          center={[0, 0, contactHeight / 2]}
          size={[exposedPadWidth, exposedPadHeight, contactHeight]}
        />
      )}
      <RoundedCuboid
        color="#303236"
        center={[0, 0, contactHeight + bodyHeight / 2]}
        size={[bodyWidth, bodyLength, bodyHeight]}
        roundRadius={cornerRadius}
      />
      <Cylinder
        color="#777a7f"
        center={[
          -bodyWidth * 0.33,
          -bodyLength * 0.37,
          contactHeight + bodyHeight + 0.012,
        ]}
        height={0.024}
        radius={Math.min(bodyWidth, bodyLength) * 0.045}
      />
    </>
  )
}
