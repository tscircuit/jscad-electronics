import { Cuboid, Colorize, Hull, Rotate, Translate } from "jscad-fiber"
import { SmdChipLead } from "./SmdChipLead"

export const PinRow = ({
  numberOfPins,
  pitch = 2.54,
  longSidePinLength = 6,
  invert,
  faceup,
  rows = 1,
  smd,
  rightangle,
}: {
  numberOfPins: number
  pitch?: number
  longSidePinLength?: number
  invert?: boolean
  faceup?: boolean
  rows?: number
  smd?: boolean
  rightangle?: boolean
}) => {
  const pinThickness = 0.63
  const bodyHeight = 2
  const pinsPerRow = Math.ceil(numberOfPins / rows)
  const rowSpacing = 2.54 // Standard spacing between rows
  const bodyWidth = pinsPerRow * pitch
  const bodyDepth =
    rows > 1 ? (rows - 1) * rowSpacing + pinThickness * 3 : pinThickness * 3
  const shortSidePinLength = 3
  const xoff = -((pinsPerRow - 1) / 2) * pitch
  // Row 1 starts at y=0, subsequent rows are positioned below (negative y)
  const bodyCenterY = rows > 1 ? -((rows - 1) * rowSpacing) / 2 : 0

  // Flip Z coordinates if invert is true
  const flipZ = (z: number) => (invert || faceup ? -z + bodyHeight : z)

  return (
    <>
      <Translate y={rightangle ? -3 : 0}>
        <Cuboid
          color="#222"
          size={[bodyWidth, bodyDepth, bodyHeight]}
          center={[0, bodyCenterY, flipZ(bodyHeight / 2)]}
        />
      </Translate>
      {Array.from({ length: numberOfPins }, (_, i) => {
        const row = Math.floor(i / pinsPerRow)
        const col = i % pinsPerRow
        const x = xoff + col * pitch
        // Row 1 (row 0) starts at y=0, subsequent rows go downward (negative y)
        const y = -row * rowSpacing

        return (
          <>
            {/*Short pins (top) */}
            {!faceup && (
              <Colorize color="gold" key={`short-${i}`}>
                {smd ? (
                  <SmdChipLead
                    key={`short-smd-${i}`}
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
                      size={[
                        pinThickness,
                        pinThickness,
                        shortSidePinLength * 0.9,
                      ]}
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
            <Colorize color="gold" key={`long-${i}`}>
              <Translate y={rightangle ? -3.9 : 0} z={rightangle ? 1 : 0}>
                <Rotate
                  key={`rotate-${i}`}
                  rotation={rightangle ? [-Math.PI / 2, 0, 0] : [0, 0, 0]}
                >
                  {/*Long pins (bottom) */}

                  <Hull>
                    <Cuboid
                      color="gold"
                      size={[
                        pinThickness,
                        pinThickness,
                        longSidePinLength * 0.9,
                      ]}
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
      })}
    </>
  )
}
