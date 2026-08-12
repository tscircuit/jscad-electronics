import { Cuboid } from "jscad-fiber"
import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export interface SOD123Props {
  /** Overall package length, including the leads, in millimeters. */
  fullWidth?: number
  /** Molded package width in millimeters. */
  fullLength?: number
}

/**
 * SOD-123 diode package.
 *
 * The defaults are the nominal dimensions from the Vishay 1N4148W package
 * drawing: https://www.vishay.com/docs/86356/1n4148w.pdf
 */
export const SOD123 = ({
  fullWidth = 3.7,
  fullLength = 1.55,
}: SOD123Props = {}) => {
  const bodyWidth = fullWidth - 1
  const bodyLength = fullLength
  const packageHeight = 1.175
  const bodyStandoff = 0.1
  const bodyHeight = packageHeight - bodyStandoff
  const leadWidth = 0.55
  const leadThickness = 0.12
  const leadHeight = 0.35
  const bodyDistance = (fullWidth - bodyWidth) / 2
  const padContactLength = 0.25
  const leadCurveLength = 0.2

  return (
    <>
      <SmdChipLead
        position={{
          x: -fullWidth / 2,
          y: 0,
          z: leadThickness / 2,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={bodyDistance}
        curveLength={leadCurveLength}
        height={leadHeight}
      />

      <SmdChipLead
        rotation={Math.PI}
        position={{
          x: fullWidth / 2,
          y: 0,
          z: leadThickness / 2,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={bodyDistance}
        curveLength={leadCurveLength}
        height={leadHeight}
      />

      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
        heightAboveSurface={bodyStandoff}
        includeNotch={false}
        color="#222"
        taperRatio={0.06}
        straightHeightRatio={0.6}
      />

      <Cuboid
        color="#777"
        size={[0.45, bodyLength - 0.15, 0.02]}
        center={[-bodyWidth / 4, 0, packageHeight]}
      />
    </>
  )
}

export default SOD123
