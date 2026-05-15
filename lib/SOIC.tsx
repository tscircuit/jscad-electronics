import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

// SOIC typical body and lead dimensions
export const SOIC = ({
  pinCount,
  leadLength,
  leadWidth,
  pitch,
  bodyWidth,
}: {
  pinCount: number
  pitch: number
  leadWidth: number
  leadLength: number
  bodyWidth: number
}) => {
  const sidePinCount = Math.ceil(pinCount / 2)
  const pinOffsetToCenter = ((sidePinCount - 1) * pitch) / 2
  const leadThickness = 0.25
  const bodyHeight = 1.0
  const leadHeight = 0.8
  const leadBodyOffset = leadLength * 0
  const fullLength = pitch * (sidePinCount - 1) + leadWidth + 0.2
  // SOIC body width is typically ~60% of the total width between lead tips
  // to leave space for the leads on each side
  const bodyWidthAdjusted = bodyWidth * 0.6

  return (
    <>
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={i}
          position={{
            x: -bodyWidth / 2 - leadBodyOffset,
            y: i * pitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={leadLength / 2}
          bodyDistance={leadLength + 0.3}
          height={leadHeight}
        />
      ))}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={i}
          rotation={Math.PI}
          position={{
            x: bodyWidth / 2 + leadBodyOffset,
            y: i * pitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={leadLength / 2}
          bodyDistance={leadLength + 0.3}
          height={leadHeight}
        />
      ))}
      <ChipBody
        center={{ x: 0, y: 0, z: leadThickness / 2 }}
        width={bodyWidthAdjusted}
        length={fullLength}
        height={bodyHeight}
        // Taper the body so top face is slightly narrower than bottom
        // giving a more realistic 3D chip appearance
        taperRatio={0.08}
        faceRatio={0.78}
        straightHeightRatio={0.5}
        // Add chamfered edges for realistic look
        chamferSize={0.04}
        // Include pin-1 notch at the top center of the chip
        includeNotch={true}
        notchRadius={0.15}
        notchLength={0.35}
        notchWidth={0.2}
      />
    </>
  )
}