import {
  Colorize,
  Cuboid,
  Cylinder,
  Rotate,
  Subtract,
  Translate,
} from "jscad-fiber"
import { ChipBody } from "./ChipBody"

export interface Led5050Props {
  color?: string
  bodyColor?: string
  leadColor?: string
}

export const Led5050 = ({
  color = "#ffff00",
  bodyColor = "#ffffff",
  leadColor = "#dedede",
}: Led5050Props) => {
  const bodySize = 5
  const leadSpan = 5.4
  const bodyBottom = 0.2
  const bodyHeight = 1.3
  const bodyTop = bodyBottom + bodyHeight
  const leadLength = 1.4
  const leadWidth = 1
  const leadThickness = 0.2
  const leadCenterX = leadSpan / 2 - leadLength / 2
  const lensRadius = 2
  const lensHeight = 0.25
  const lensTop = 1.55
  const cornerCutDepth = 0.3
  const leadYPositions = [-1.7, 0, 1.7]
  const leadSides = [-1, 1]

  return (
    <>
      {leadYPositions.flatMap((y) =>
        leadSides.map((side) => (
          <Cuboid
            key={`${side}-${y}`}
            color={leadColor}
            size={[leadLength, leadWidth, leadThickness]}
            center={[side * leadCenterX, y, leadThickness / 2]}
          />
        )),
      )}

      <Colorize color={bodyColor}>
        <Subtract>
          <ChipBody
            width={bodySize}
            length={bodySize}
            height={bodyHeight}
            heightAboveSurface={bodyBottom}
            center={{ x: 0, y: 0, z: 0 }}
            color={bodyColor}
            taperRatio={0.036}
            straightHeightRatio={0.01}
            includeNotch={false}
          />
          <Cylinder
            radius={lensRadius}
            height={lensHeight}
            center={[0, 0, bodyTop - lensHeight / 2]}
          />
          <Translate
            offset={[
              -bodySize / 2,
              bodySize / 2,
              bodyTop - cornerCutDepth / 2 + 0.005,
            ]}
          >
            <Rotate rotation={[0, 0, Math.PI / 4]}>
              <Cuboid size={[0.9, 0.9, cornerCutDepth + 0.01]} />
            </Rotate>
          </Translate>
        </Subtract>
      </Colorize>

      <Cylinder
        color={color}
        radius={lensRadius}
        height={lensHeight}
        center={[0, 0, lensTop - lensHeight / 2]}
      />
    </>
  )
}

export default Led5050
