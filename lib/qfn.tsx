import { Cuboid, Colorize } from "jscad-fiber"
import { getQuadCoords } from "./utils/getQuadCoords"
import { getQuadPinMap } from "./utils/getQuadPinMap"
export const QFN = ({
  num_pins = 16,
  bodyWidth = 9,
  bodyLength = 9,
  bodyThickness = 0.8,
  thermalPadSize,
  padWidth = 0.25,
  padLength = 0.25,
  pitch = 0.5,
  thermalPadThickness = 0.1,
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
  const pin_map = getQuadPinMap({
    num_pins,
    cw: true,
    ccw: true,
  })
  const pinPositions = []
  const spc = num_pins / 4
  for (let i = 0; i < num_pins; i++) {
    const {
      x,
      y,
      o: orientation,
    } = getQuadCoords({
      pin_count: num_pins,
      pn: i + 1,
      w: bodyWidth,
      h: bodyLength,
      p: pitch,
      pl: padLength,
      legsoutside: false,
    })

    let pw = padWidth
    let pl = padLength
    if (orientation === "vert") {
      ;[pw, pl] = [pl, pw]
    }

    const pn = pin_map[i + 1]!
    pinPositions.push({ pn, x, y, pw, pl })
  }

  return (
    <>
      <Colorize color="grey">
        <Cuboid
          center={{ x: 0, y: 0, z: bodyThickness / 2 }}
          size={[bodyWidth, bodyLength, bodyThickness]}
        />
      </Colorize>
      {pinPositions.map((p, i) => (
        <Colorize color="#ff0000" key={i}>
          <Cuboid
            center={{ x: p.x, y: p.y, z: thermalPadThickness / 2 }}
            size={[p.pw, p.pl, thermalPadThickness]}
          />
        </Colorize>
      ))}
      {thermalPadSize?.length !== undefined &&
        thermalPadSize?.width !== undefined && (
          <Colorize color="#ff0000">
            <Cuboid
              center={{ x: 0, y: 0, z: thermalPadThickness / 2 }}
              size={[
                thermalPadSize.width,
                thermalPadSize.length,
                thermalPadThickness,
              ]}
            />
          </Colorize>
        )}
    </>
  )
}

export default QFN
