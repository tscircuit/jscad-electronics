import { Colorize, Cuboid, Hull, Rotate, Translate } from "jscad-fiber"
import { SmdChipLead } from "./SmdChipLead"

export const Pin = ({
  x,
  y,
  pinThickness,
  shortSidePinLength,
  longSidePinLength,
  bodyHeight,
  bodyLength = 2.54,
  bbodyWidth = 2.54,
  flipZ,
  faceup,
  smd,
  rightangle,
}: {
  x: number
  y: number
  pinThickness: number
  shortSidePinLength: number
  longSidePinLength: number
  bodyHeight: number
  bodyLength?: number
  bbodyWidth?: number
  flipZ: (z: number) => number
  faceup?: boolean
  smd?: boolean
  rightangle?: boolean
}) => {
  return (
    <>
    <Translate y={rightangle ? -3 : 0}>
        <Cuboid
          color="#222"
          size={[bodyLength, bbodyWidth , bodyHeight]}
          center={[x, y, flipZ(bodyHeight / 2)]}
        />
      </Translate>
      {!faceup && (
        <Colorize color="gold">
          {smd ? (
            <SmdChipLead
              rotation={-Math.PI / 2}
              position={{
                x: x,
                y: y + 1,
                z: pinThickness / 2,
              }}
              thickness={pinThickness}
              width={pinThickness}
              height={pinThickness}
              padContactLength={2}
              bodyDistance={3}
            />
          ) : (
            <Hull>
              <Cuboid
                color="gold"
                size={[pinThickness, pinThickness, shortSidePinLength * 0.9]}
                center={[x, y, flipZ(bodyHeight * 0.9 + bodyHeight / 2)]}
              />
              <Cuboid
                color="gold"
                size={[
                  pinThickness / 1.8,
                  pinThickness / 1.8,
                  shortSidePinLength,
                ]}
                center={[x, y, flipZ(bodyHeight + bodyHeight / 2)]}
              />
            </Hull>
          )}
        </Colorize>
      )}

      <Colorize color="gold">
        <Translate y={rightangle ? -3.9 : 0} z={rightangle ? 1 : 0}>
          <Rotate rotation={rightangle ? [-Math.PI / 2, 0, 0] : [0, 0, 0]}>
            <Hull>
              <Cuboid
                color="gold"
                size={[pinThickness, pinThickness, longSidePinLength * 0.9]}
                center={[x, y, flipZ((-longSidePinLength / 2) * 0.9)]}
              />
              <Cuboid
                color="gold"
                size={[pinThickness / 1.8, pinThickness / 1.8, longSidePinLength]}
                center={[x, y, flipZ(-longSidePinLength / 2)]}
              />
            </Hull>
          </Rotate>
        </Translate>
      </Colorize>
    </>
  )
}
