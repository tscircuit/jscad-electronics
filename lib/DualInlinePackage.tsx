import {
  Polygon,
  ExtrudeLinear,
  Rotate,
  Translate,
  Union,
  Subtract,
  Cylinder,
} from "jscad-fiber"
import { ChipBody } from "./ChipBody"
import { range } from "./utils/range"
import { getExpandedStroke } from "./utils/getExpandedStroke"

// DIP components look like this:
// https://github.com/nophead/NopSCADlib/raw/master/tests/png/dip.png

// M 20 105 L 20 109 L 20 102 L 26 102 L 26 109 L 24 111 L 24 118 L 22 118 L 22 111 L 20 109

const normalizeOnY = (points: { x: number; y: number }[]) => {
  const minX = Math.min(...points.map((p) => p.x))
  const maxX = Math.max(...points.map((p) => p.x))
  const minY = Math.min(...points.map((p) => p.y))
  const maxY = Math.max(...points.map((p) => p.y))
  const height = maxY - minY
  const factor = 5.47 / height
  return points.map((p) => ({
    x: (p.x - minX - (maxX - minX) / 2) * factor,
    y: (p.y - minY) * factor,
  }))
}

const svgPathPoints = normalizeOnY([
  { x: 20, y: 105 },
  { x: 20, y: 109 },
  { x: 20, y: 102 },
  { x: 26, y: 102 },
  { x: 26, y: 109 },
  { x: 24, y: 111 },
  { x: 24, y: 118 },
  { x: 22, y: 118 },
  { x: 22, y: 111 },
  { x: 20, y: 109 },
])

const DIP_PIN_HEIGHT = 5.47
const heightAboveSurface = 0.5

export const DipPinLeg = ({ x, y, z }: { x: number; y: number; z: number }) => {
  const isRotated = x > 0
  return (
    <>
      <Translate offset={{ x: x + 0.25 / 2, y, z: z }}>
        <Rotate rotation={["-90deg", 0, "90deg"]}>
          <ExtrudeLinear height={0.25}>
            <Polygon points={svgPathPoints.map((p) => [p.x, p.y])} />
          </ExtrudeLinear>
        </Rotate>
      </Translate>
      <Translate
        offset={{
          x: x,
          y: y + (isRotated ? 1 : -1),
          z: z,
        }}
      >
        <Rotate rotation={["-90deg", "90deg", isRotated ? "180deg" : "0deg"]}>
          <ExtrudeLinear height={2}>
            <Polygon
              points={getExpandedStroke(
                [
                  [0, 0],
                  [-1, 0],
                  [-1, -1],
                ],
                0.25,
              ).map((p) => [p.x, p.y])}
            />
          </ExtrudeLinear>
        </Rotate>
      </Translate>
    </>
  )
}

export const Dip = ({
  numPins = 8,
  pitch = 2.54,
  bodyWidth = 6.4,
}: { numPins?: number; pitch?: number; bodyWidth?: number }) => {
  const numPinsOnEachSide = Math.floor(numPins / 2)
  const crossBodyPinWidth = bodyWidth + 1
  const bodyLength = numPinsOnEachSide * pitch + 0.5
  const notchRadius = bodyWidth * 0.25

  return (
    <>
      {range(numPins).map((i) => {
        const yRow = i % numPinsOnEachSide
        const xRow = (Math.floor(i / numPinsOnEachSide) - 0.5) * 2

        return (
          <DipPinLeg
            key={i}
            x={(xRow * crossBodyPinWidth) / 2}
            y={yRow * pitch - ((numPinsOnEachSide - 1) / 2) * pitch}
            z={DIP_PIN_HEIGHT / 2 + heightAboveSurface}
          />
        )
      })}
      <Subtract>
        <ChipBody
          width={bodyWidth}
          length={bodyLength}
          height={DIP_PIN_HEIGHT - heightAboveSurface}
          heightAboveSurface={heightAboveSurface}
          center={{ x: 0, y: 0, z: heightAboveSurface }}
        />
        <Translate
          offset={{
            x: bodyWidth / 2,
            y: 0,
            z:
              heightAboveSurface +
              (DIP_PIN_HEIGHT - heightAboveSurface) -
              notchRadius,
          }}
        >
          <Rotate rotation={["90deg", 0, 0]}>
            <Cylinder height={bodyLength * 1.1} radius={notchRadius} />
          </Rotate>
        </Translate>
      </Subtract>
    </>
  )
}

export const DualInlinePackage = Dip
