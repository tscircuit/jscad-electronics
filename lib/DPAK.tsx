import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

interface DPAKProps {
  /** number of gull-wing leads (tab side excluded), default 3 */
  numPins?: number
  /** package width across leads (footprint w) */
  bodyWidth?: number
  /** package length (footprint h) */
  bodyLength?: number
  bodyHeight?: number
  /** pitch between gull-wing leads */
  pitch?: number
  leadWidth?: number
  leadThickness?: number
  leadHeight?: number
  padContactLength?: number
  /** heatsink tab width (footprint tabw) */
  tabWidth?: number
  /** heatsink tab length (footprint tabh) */
  tabLength?: number
}

/**
 * Parametric DPAK-family package: DPAK / TO-252, D2PAK / TO-263.
 * Gull-wing leads on one side, wide heatsink tab on the other.
 */
export const DPAK = ({
  numPins = 3,
  bodyWidth = 6.6,
  bodyLength = 6.5,
  bodyHeight = 2.3,
  pitch = 2.29,
  leadWidth = 0.9,
  leadThickness = 0.25,
  leadHeight = 1.15,
  padContactLength = 0.6,
  tabWidth = 6.2,
  tabLength = 2.5,
}: DPAKProps) => {
  const leadSpan = (numPins - 1) * pitch
  const startY = -leadSpan / 2

  return (
    <>
      {/* Gull-wing leads on the left side */}
      {Array.from({ length: numPins }).map((_, i) => (
        <SmdChipLead
          key={i}
          position={{
            x: -bodyWidth / 2 - padContactLength / 2,
            y: startY + i * pitch,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength}
          bodyDistance={1.2}
          height={leadHeight}
        />
      ))}

      {/* Heatsink tab on the right side */}
      <SmdChipLead
        rotation={Math.PI}
        position={{
          x: bodyWidth / 2 + tabLength / 2,
          y: 0,
          z: leadThickness / 2,
        }}
        width={tabWidth}
        thickness={leadThickness}
        padContactLength={tabLength}
        bodyDistance={0.6}
        height={leadHeight}
      />

      {/* Package body */}
      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
        includeNotch={false}
        taperRatio={0.06}
        straightHeightRatio={0.4}
      />
    </>
  )
}

export default DPAK
