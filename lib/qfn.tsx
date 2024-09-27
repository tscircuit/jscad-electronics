import { Cuboid, Colorize } from "jscad-fiber"

export const QFN = ({
  fullWidth = 5,
  height = 0.8,
  thermalPadSize = 2,
}: {
  fullWidth?: number
  height?: number
  thermalPadSize?: number
}) => {
  const bodyWidth = fullWidth
  const bodyLength = fullWidth
  const thermalPadHeight = 0.1
  return (
    <>
      <Colorize color="grey">
        <Cuboid
          center={{ x: 0, y: 0, z: height / 2 }}
          size={[bodyWidth, bodyLength, height]}
        />
      </Colorize>
      <Cuboid
        center={{ x: 0, y: 0, z: -thermalPadHeight / 2 }}
        size={[thermalPadSize, thermalPadSize, thermalPadHeight]}
      />
    </>
  )
}

export default QFN
