import { Colorize, Cuboid, Cylinder, Subtract } from "jscad-fiber"

interface JSHZH1_5mmProps {
  numPins?: number
  showPins?: boolean
  bodyColor?: string
  pinColor?: string
}

export const JSHZH1_5mm = ({
  numPins = 2,
  showPins = true,
  bodyColor = "#f5f5f5",
  pinColor = "#635959",
}: JSHZH1_5mmProps) => {
  const pitch = 1.5
  const bodyHeight = 6
  const bodyDepth = 3.5
  const wallThickness = 0.5
  const hollowHeight = bodyHeight * 0.6
  const pinLength = 6
  const bodyWidth = (numPins - 1) * pitch + 4
  const startX = -((numPins - 1) * pitch) / 2

  return (
    <>
      <Colorize color={bodyColor}>
        <Subtract>
          <Cuboid
            size={[bodyWidth, bodyDepth, bodyHeight]}
            center={[0, 0, bodyHeight / 2]}
          />
          <Cuboid
            size={[
              bodyWidth - wallThickness * 2,
              bodyDepth - wallThickness * 2,
              hollowHeight,
            ]}
            center={[0, 0, hollowHeight / 2]}
          />
          <Cuboid
            size={[bodyWidth, bodyDepth / 3, hollowHeight]}
            center={[0, 0, hollowHeight / 6]}
          />
          <Cuboid
            size={[
              bodyWidth - wallThickness * 2,
              wallThickness / 2,
              hollowHeight,
            ]}
            center={[0, bodyDepth / 2 - wallThickness / 4, hollowHeight / 2]}
          />
          <Cuboid
            size={[
              bodyWidth - wallThickness * 2,
              wallThickness / 2,
              hollowHeight,
            ]}
            center={[0, -bodyDepth / 2 + wallThickness / 4, hollowHeight / 2]}
          />
          <Cuboid
            size={[1, wallThickness + 2, 1]}
            center={[-bodyWidth / 4, bodyDepth / 2, bodyHeight / 2]}
          />
          <Cuboid
            size={[1, wallThickness + 3, 1]}
            center={[bodyWidth / 4, bodyDepth / 2, bodyHeight / 2]}
          />
          <Cuboid
            size={[1, wallThickness + 2, 1]}
            center={[-bodyWidth / 4, -bodyDepth / 2, bodyHeight / 2]}
          />
          <Cuboid
            size={[1, wallThickness + 3, 1]}
            center={[bodyWidth / 4, -bodyDepth / 2, bodyHeight / 2]}
          />
        </Subtract>
      </Colorize>

      {showPins &&
        Array.from({ length: numPins }).map((_, i) => (
          <Colorize key={i} color={pinColor}>
            <Cylinder
              height={pinLength}
              radius={0.35}
              center={[startX + i * pitch, 0, bodyHeight / 1]}
            />
          </Colorize>
        ))}
    </>
  )
}

export default JSHZH1_5mm
