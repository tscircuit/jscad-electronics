import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

interface SmdDiodeProps {
  /** total width including leads (footprint w) */
  fullWidth?: number
  bodyWidth?: number
  bodyLength?: number
  bodyHeight?: number
  leadWidth?: number
  leadThickness?: number
  leadHeight?: number
  padContactLength?: number
}

/**
 * Generic parametric 2-pin SMD diode/small-2-terminal package
 * (covers SOD-110, SOD-80, SOD-323W, SOD-882D, SMBF and similar).
 */
export const SmdDiode = ({
  fullWidth = 3.3,
  bodyWidth = fullWidth * 0.72,
  bodyLength = 1.7,
  bodyHeight = bodyLength * 0.7,
  leadWidth = 0.8,
  leadThickness = 0.15,
  leadHeight = 0.5,
  padContactLength = 0.4,
}: SmdDiodeProps) => {
  const padThickness = leadThickness / 2
  const bodyDistance = (fullWidth - bodyWidth) / 2

  return (
    <>
      {/* Lead on the left side */}
      <SmdChipLead
        key={1}
        position={{
          x: -fullWidth / 2 + leadWidth / 2,
          y: 0,
          z: padThickness,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={bodyDistance}
        height={leadHeight}
      />

      {/* Lead on the right side */}
      <SmdChipLead
        key={2}
        rotation={Math.PI}
        position={{
          x: fullWidth / 2 - leadWidth / 2,
          y: 0,
          z: padThickness,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={bodyDistance}
        height={leadHeight}
      />

      {/* Chip Body */}
      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
      />
    </>
  )
}

export default SmdDiode
