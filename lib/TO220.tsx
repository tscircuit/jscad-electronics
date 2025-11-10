import {
  Colorize,
  Cuboid,
  Hull,
  Rotate,
  Translate,
  Cylinder,
  Subtract,
} from "jscad-fiber"
import { ChipBody } from "./ChipBody"

export const TO220 = () => {
  const fullLength = 20
  const bodyLength = 9.9
  const bodyHeight = 4.5
  const zOffset = 1

  const padWidth = 9.9
  const padLength = 6.5
  const padThickness = 1.3
  const padHoleDiameter = 3.0

  const prongWidth = 0.81
  const prongLength = 16
  const prongHeight = 0.5
  const prongPitch = 2.7

  const bodyWidth = padWidth

  const bodyFrontX = fullLength - bodyLength / 2 // left face of body
  const bodyBackX = fullLength + bodyLength / 2 // right face of body
  const prongCenterX = bodyFrontX - prongLength / 2 // prong centered so its inner face touches bodyFront
  const padCenterX = bodyBackX + padLength / 2 // pad centered so its inner face touches bodyBack

  return (
    <Translate center={[0, 0, zOffset]}>
      <>
        <Rotate rotation={[0, 55, -55]}>
          {/* Pads (with centered hole for pin alignment) */}
          <Subtract>
            <Cuboid
              color="#ccc"
              size={[padLength + 0.1, padWidth, padThickness]}
              center={[padCenterX, 0, padThickness - 2]}
            />
            {/* hole centered through pad */}
            <Cylinder
              color="black"
              center={[padCenterX, 0, padThickness - 2]}
              radius={padHoleDiameter / 2}
              height={padThickness * 1.2}
            />
          </Subtract>
          {/* Body (lifted above pads) */}
          <Colorize color="#222">
            <ChipBody
              width={bodyWidth}
              length={bodyLength}
              height={bodyHeight}
              center={{ x: fullLength, y: 0, z: -2.4 }}
              includeNotch={false}
              straightHeightRatio={0.3}
              taperRatio={0.04}
              heightAboveSurface={1}
            />
          </Colorize>
        </Rotate>
        <Rotate rotation={[0, 55, 55]}>
          {Array.from({ length: 3 }).map((_, i) => {
            const x = prongCenterX
            const y = (i - 1) * prongPitch
            // prongs sit on top of pads (pad top z = padThickness)
            const z = -prongHeight - 0.6
            return (
              <Colorize key={`prong-${i}`} color="gold">
                <Hull>
                  {/* inner fillet pieces anchored to the body front so they stay correct when prongLength changes */}
                  <Translate center={[bodyFrontX - bodyHeight / 2 + 0.1, y, z]}>
                    <Cuboid size={[bodyHeight, prongWidth + 1, prongHeight]} />
                  </Translate>
                  <Translate
                    center={[bodyFrontX - bodyHeight / 2 - 1 + 0.1, y, z]}
                  >
                    <Cuboid size={[bodyHeight, prongWidth, prongHeight]} />
                  </Translate>
                </Hull>
                <Translate center={[x, y, z]}>
                  <Cuboid size={[prongLength + 0.1, prongWidth, prongHeight]} />
                </Translate>
              </Colorize>
            )
          })}
        </Rotate>
      </>
    </Translate>
  )
}
