import { Cuboid, Rotate, Translate } from "jscad-fiber"
import { SmdChipLead } from "./SmdChipLead"
import { Pin3d } from "./Pin3d"

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

  const zOffset = !smd && !rightangle ? -bodyHeight - 1.6 : 0
  const flipZ = (z: number) => (invert || faceup ? -z + bodyHeight : z) + zOffset

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
        const y = -row * rowSpacing

        const longCenterZ = flipZ(-longSidePinLength / 2)
        const shortCenterZ = flipZ(bodyHeight + bodyHeight / 2)

        return (
          <>
            {!faceup && (
              smd ? (
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
                <Pin3d
                  key={`short-${i}`}
                  x={x}
                  y={y}
                  longLength={longSidePinLength}
                  shortLength={shortSidePinLength}
                  longCenterZ={longCenterZ}
                  shortCenterZ={shortCenterZ}
                  renderLong={false}
                />
              )
            )}
            <Translate y={rightangle ? -3.9 : 0} z={rightangle ? 1 : 0}>
              <Rotate
                key={`rotate-${i}`}
                rotation={rightangle ? [-Math.PI / 2, 0, 0] : [0, 0, 0]}
              >
                <Pin3d
                  key={`long-${i}`}
                  x={x}
                  y={y}
                  longLength={longSidePinLength}
                  shortLength={shortSidePinLength}
                  longCenterZ={longCenterZ}
                  shortCenterZ={shortCenterZ}
                  renderShort={false}
                />
              </Rotate>
            </Translate>
          </>
        )
      })}
    </>
  )
}
