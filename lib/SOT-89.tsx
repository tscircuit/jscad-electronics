import { ChipBody } from "./ChipBody"
import { Cuboid, Subtract, Translate, Rotate } from "jscad-fiber"

export const SOT89 = () => {
  // Calculated dimensions
  const leadThickness = 0.44
  const bodyLength = 4.6
  const bodyWidth = 2.6
  const bodyHeight = 1.6
  const leadExtension = 1.2

  // Lead widths
  const leadWidth = 0.53

  const pinSpacing = 1.5

  const fullWidth = 3.5
  const chamferSize = 0.4

  return (
    <>
      {/* Exposed die pad on the right side (large heat sink pad) */}
      <Subtract>
        <Cuboid
          color="#fff"
          size={[leadExtension + 1.5, bodyWidth - 1, leadThickness]}
          center={[fullWidth / 2 - leadExtension, 0, leadThickness / 2]}
        />
        {/* Chamfer cutouts at corners */}
        <Translate
          offset={[
            fullWidth / 2 + leadExtension / 6,
            (bodyWidth - 1) / 2,
            leadThickness / 2,
          ]}
        >
          <Rotate rotation={[0, 0, Math.PI / 4]}>
            <Cuboid
              size={[
                chamferSize * Math.SQRT2,
                chamferSize * Math.SQRT2,
                leadThickness * 3,
              ]}
            />
          </Rotate>
        </Translate>
        <Translate
          offset={[
            fullWidth / 2 + leadExtension / 6,
            -(bodyWidth - 1) / 2,
            leadThickness / 2,
          ]}
        >
          <Rotate rotation={[0, 0, Math.PI / 4]}>
            <Cuboid
              size={[
                chamferSize * Math.SQRT2,
                chamferSize * Math.SQRT2,
                leadThickness * 3,
              ]}
            />
          </Rotate>
        </Translate>
      </Subtract>

      {/* Lead on the left side (pin 1) */}
      <Cuboid
        color="#fff"
        size={[leadExtension, leadWidth, leadThickness]}
        center={[-fullWidth / 2, -pinSpacing, leadThickness / 2]}
      />

      {/* Lead on the left side (pin 2) - center lead */}
      <Cuboid
        color="#fff"
        size={[leadExtension + 1, leadWidth, leadThickness]}
        center={[-fullWidth / 2 + 0.5, 0, leadThickness / 2]}
      />

      {/* Lead on the left side (pin 3) */}
      <Cuboid
        color="#fff"
        size={[leadExtension, leadWidth, leadThickness]}
        center={[-fullWidth / 2, pinSpacing, leadThickness / 2]}
      />

      {/* Chip Body */}
      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
        includeNotch={false}
        taperRatio={0.1}
        straightHeightRatio={0.28}
        heightAboveSurface={0}
      />
    </>
  )
}

export default SOT89
