import {
  Colorize,
  Cuboid,
  Cylinder,
  ExtrudeLinear,
  Polygon,
  Rotate,
  RoundedCuboid,
  Translate,
} from "jscad-fiber"
import { getExpandedStroke } from "./utils/getExpandedStroke"

export const PushButton = ({
  width,
  length,
  innerDiameter = 1,
}: {
  width: number
  length: number
  innerDiameter?: number
}) => {
  const bodyWidth = width
  const bodyLength = length
  const bodyHeight = width * 0.7
  const legWidth = innerDiameter / 2.5
  return (
    <>
      <RoundedCuboid
        color="#1a1a1f"
        center={[0, 0, bodyHeight / 2]}
        size={[bodyLength, bodyLength, bodyHeight]}
        roundRadius={0.3}
      />
      <RoundedCuboid
        color="#f2f2f2"
        center={[0, 0, bodyHeight + (bodyHeight * 0.1) / 2.5]}
        size={[bodyLength, bodyLength, bodyHeight * 0.1]}
        roundRadius={0.14}
      />
      <Cylinder
        color="#1a1a1f"
        height={bodyHeight * 0.8}
        radius={bodyWidth / 3}
        center={[0, 0, bodyHeight + (bodyHeight * 0.8) / 2]}
      />
      <Cylinder
        color="#1a1a1f"
        height={bodyHeight * 0.2}
        radius={innerDiameter / 2}
        center={[
          bodyLength / 3,
          bodyLength / 3,
          bodyHeight + (bodyHeight * 0.1) / 2,
        ]}
      />
      <Cylinder
        color="#1a1a1f"
        height={bodyHeight * 0.2}
        radius={innerDiameter / 2}
        center={[
          -bodyLength / 3,
          -bodyLength / 3,
          bodyHeight + (bodyHeight * 0.1) / 2,
        ]}
      />
      <Cylinder
        color="#1a1a1f"
        height={bodyHeight * 0.2}
        radius={innerDiameter / 2}
        center={[
          -bodyLength / 3,
          bodyLength / 3,
          bodyHeight + (bodyHeight * 0.1) / 2,
        ]}
      />
      <Cylinder
        color="#1a1a1f"
        height={bodyHeight * 0.2}
        radius={innerDiameter / 2}
        center={[
          bodyLength / 3,
          -bodyLength / 3,
          bodyHeight + (bodyHeight * 0.1) / 2,
        ]}
      />
      <PushButtonLeg
        thickness={innerDiameter / 3}
        width={legWidth}
        horizontalLength={bodyLength * 0.8}
        verticalLength={bodyHeight / 2}
        position={{
          x: -bodyWidth / 2,
          y: -bodyLength / 2,
          z: -bodyHeight * 1.2,
        }}
      />
      <PushButtonLeg
        thickness={innerDiameter / 3}
        width={legWidth}
        horizontalLength={bodyLength * 0.8}
        verticalLength={bodyHeight / 2}
        position={{
          x: -bodyWidth / 2,
          y: bodyLength / 2,
          z: -bodyHeight * 1.2,
        }}
        rotation={Math.PI}
      />
      <PushButtonLeg
        thickness={innerDiameter / 3}
        width={legWidth}
        horizontalLength={bodyLength * 0.8}
        verticalLength={bodyHeight / 2}
        position={{ x: bodyWidth / 2, y: bodyLength / 2, z: -bodyHeight * 1.2 }}
        rotation={Math.PI}
      />
      <PushButtonLeg
        thickness={innerDiameter / 3}
        width={legWidth}
        horizontalLength={bodyLength * 0.8}
        verticalLength={bodyHeight / 2}
        position={{
          x: bodyWidth / 2 + innerDiameter / 3.6,
          y: -bodyLength / 2,
          z: -bodyHeight * 1.2,
        }}
      />
    </>
  )
}
export interface PushButtonLegProps {
  thickness: number
  width: number
  horizontalLength: number
  verticalLength: number
  rotation?: number
  position?: { x: number; y: number; z?: number }
}

export const PushButtonLeg = (props: PushButtonLegProps) => {
  const {
    thickness,
    width,
    horizontalLength,
    verticalLength,
    rotation = 0,
    position,
  } = props
  const points: [number, number][] = [
    [0, horizontalLength],
    [-verticalLength / 3, horizontalLength / 3],
    [-verticalLength / 5, horizontalLength / 4],
    [0, 0],
  ]
  const polygon = getExpandedStroke(points, thickness)

  return (
    <Colorize color="#f2f2f2">
      <Translate
        offset={{
          x: position?.x || 0,
          y: position?.y || 0,
          z: position?.z || 0,
        }}
      >
        <Rotate rotation={[0, 55, rotation]}>
          <ExtrudeLinear height={width}>
            <Polygon points={polygon.map((p) => [p.y, p.x])} />
          </ExtrudeLinear>
        </Rotate>
      </Translate>
    </Colorize>
  )
}
