import { Colorize, Cuboid, Cylinder } from "jscad-fiber"

interface LED5050Props {
  bodyWidth?: number
  bodyLength?: number
  bodyHeight?: number
  pitch?: number
  rowSpan?: number
}

/**
 * 5050 SMD RGB LED (5 x 5mm): white package, 6 pads (3 per side),
 * three emitting dots for R/G/B dies.
 */
export const LED5050 = ({
  bodyWidth = 5,
  bodyLength = 5,
  bodyHeight = 1.6,
  pitch = 1.7,
  rowSpan = 4.8,
}: LED5050Props) => {
  const startY = -pitch

  return (
    <>
      {/* 3 pads per side */}
      {[-1, 1].map((sx) =>
        [0, 1, 2].map((i) => (
          <Colorize key={`${sx}${i}`} color="#c0c0c0">
            <Cuboid
              size={[1.1, 1.0, 0.1]}
              center={[(sx * rowSpan) / 2, startY + i * pitch, 0.05]}
            />
          </Colorize>
        )),
      )}

      {/* White body */}
      <Colorize color="#f2f2f2">
        <Cuboid
          size={[bodyWidth, bodyLength, bodyHeight]}
          center={[0, 0, bodyHeight / 2 + 0.1]}
        />
      </Colorize>

      {/* Emitting dots (R/G/B) */}
      {["#e74c3c", "#2ecc71", "#3498db"].map((color, i) => (
        <Colorize key={color} color={color}>
          <Cylinder
            radius={0.55}
            height={0.1}
            center={[(i - 1) * 1.2, 0, bodyHeight + 0.1]}
          />
        </Colorize>
      ))}
    </>
  )
}

export default LED5050
