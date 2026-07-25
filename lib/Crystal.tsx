import { Cuboid, Cylinder, RoundedCuboid } from "jscad-fiber"

export interface CrystalProps {
  padPitchX?: number
  padPitchY?: number
  padWidth?: number
  padHeight?: number
  bodyHeight?: number
}

export const Crystal = ({
  padPitchX = 2.2,
  padPitchY = 1.7,
  padWidth = 1.4,
  padHeight = 1.2,
  bodyHeight = 0.8,
}: CrystalProps) => {
  const bodyWidth = Math.max(padPitchX + padWidth - 0.4, 1.6)
  const bodyLength = Math.max(padPitchY + padHeight - 0.4, 1.2)
  const baseHeight = 0.12
  const canWidth = Math.max(bodyWidth - 0.12, 0.8)
  const canLength = Math.max(bodyLength - 0.12, 0.8)
  const canHeight = Math.max(bodyHeight - baseHeight, 0.25)
  const cornerRadius = Math.min(0.24, canWidth / 4, canLength / 4)

  return (
    <>
      <Cuboid
        color="#676a6d"
        center={[0, 0, baseHeight / 2]}
        size={[bodyWidth, bodyLength, baseHeight]}
      />
      <RoundedCuboid
        color="#c8cccf"
        center={[0, 0, baseHeight + canHeight / 2]}
        size={[canWidth, canLength, canHeight]}
        roundRadius={cornerRadius}
      />
      <Cylinder
        color="#55585b"
        center={[
          -canWidth * 0.3,
          -canLength * 0.3,
          baseHeight + canHeight + 0.012,
        ]}
        height={0.024}
        radius={Math.min(canWidth, canLength) * 0.045}
      />
    </>
  )
}
