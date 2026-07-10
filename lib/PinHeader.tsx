import { Colorize, Cuboid, Hull, Rotate, Translate } from "jscad-fiber"
import { SmdChipLead } from "./SmdChipLead"

export const PinHeader = ({
  x,
  y,
  pinThickness,
  shortSidePinLength,
  longSidePinLength,
  bodyHeight,
  bodyLength = 2.54,
  bodyWidth = 2.54,
  flipZ,
  faceup,
  smd,
  rightangle,
  invert,
}: {
  x: number
  y: number
  pinThickness: number
  shortSidePinLength: number
  longSidePinLength: number
  bodyHeight: number
  bodyLength?: number
  bodyWidth?: number
  flipZ: (z: number) => number
  faceup?: boolean
  smd?: boolean
  rightangle?: boolean
  invert?: boolean
}) => {
  if (rightangle && !smd) {
    const bendZ = bodyHeight / 2
    const tailEndZ = invert
      ? bendZ - shortSidePinLength
      : bendZ + shortSidePinLength
    const tailLength = Math.abs(tailEndZ - bendZ)
    const tailCenterZ = (tailEndZ + bendZ) / 2

    return (
      <>
        <Cuboid
          color="#222"
          size={[bodyLength, bodyWidth, bodyHeight]}
          center={[x, y - 3, bendZ]}
        />
        <Colorize color="gold">
          <Cuboid
            size={[pinThickness, pinThickness, tailLength]}
            center={[x, y, tailCenterZ]}
          />
          <Cuboid
            size={[pinThickness, longSidePinLength, pinThickness]}
            center={[x, y - longSidePinLength / 2, bendZ]}
          />
        </Colorize>
      </>
    )
  }

  return (
    <>
      <Translate y={rightangle ? -3 : 0}>
        <Cuboid
          color="#222"
          size={[bodyLength, bodyWidth, bodyHeight]}
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
                size={[
                  pinThickness / 1.8,
                  pinThickness / 1.8,
                  longSidePinLength,
                ]}
                center={[x, y, flipZ(-longSidePinLength / 2)]}
              />
            </Hull>
          </Rotate>
        </Translate>
      </Colorize>
    </>
  )
}
