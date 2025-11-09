import { Cuboid, Translate, Colorize } from "jscad-fiber"

export const SOT723 = () => {
  // Body dimensions
  const bodyWidth = 0.85
  const bodyLength = 1.2
  const bodyHeight = 0.38

  const padLength = 0.3
  const padThickness = 0.1
  const leftPadWidth = 0.2
  const rightPadWidth = 0.25

  const rightPadCenterX = 0.55
  const rightPadCenterY = 0

  const leftTopPadCenterX = -0.55
  const leftTopPadCenterY = 0.4

  const leftBottomPadCenterX = -0.55
  const leftBottomPadCenterY = -0.4

  return (
    <>
      {/* Body */}
      <Colorize color="#222">
        <Cuboid
          size={[bodyWidth, bodyLength, bodyHeight]}
          center={[0, 0, bodyHeight / 2]}
        />
      </Colorize>

      <Cuboid
        color="#ccc"
        size={[padLength, rightPadWidth, padThickness]}
        center={[rightPadCenterX, rightPadCenterY, padThickness / 2]}
      />

      <Cuboid
        color="#ccc"
        size={[padLength, leftPadWidth, padThickness]}
        center={[leftTopPadCenterX, leftTopPadCenterY, padThickness / 2]}
      />

      <Cuboid
        color="#ccc"
        size={[padLength, leftPadWidth, padThickness]}
        center={[leftBottomPadCenterX, leftBottomPadCenterY, padThickness / 2]}
      />
    </>
  )
}

export default SOT723
