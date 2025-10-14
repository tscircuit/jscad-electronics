import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export const VSSOP = ({
  pinCount,
  pitch,
  leadWidth,
  leadLength,
  bodyWidth,
  bodyLength,
}: {
  pinCount: 8 | 10
  pitch?: number
  leadWidth?: number
  leadLength?: number
  bodyWidth?: number
  bodyLength?: number
}) => {
  const defaults =
    pinCount === 8
      ? {
          pitch: 0.65,
          leadWidth: 0.3,
          leadLength: 1.6,
        }
      : {
          pitch: 0.5,
          leadWidth: 0.225,
          leadLength: 1.45,
        }

  const _pitch = !isNaN(parseFloat(pitch as any))
    ? parseFloat(pitch as any)
    : defaults.pitch
  const _leadWidth = !isNaN(parseFloat(leadWidth as any))
    ? parseFloat(leadWidth as any) * 0.8
    : defaults.leadWidth
  const _leadLength = !isNaN(parseFloat(leadLength as any))
    ? parseFloat(leadLength as any)
    : defaults.leadLength
  const _bodyWidth = !isNaN(parseFloat(bodyWidth as any))
    ? parseFloat(bodyWidth as any) * 0.8
    : 2.6
  const _bodyLength = !isNaN(parseFloat(bodyLength as any))
    ? parseFloat(bodyLength as any)
    : 2.0 + Number(_pitch) * 1.4

  const sidePinCount = pinCount / 2
  const pinOffsetToCenter = ((sidePinCount - 1) * _pitch) / 2
  const leadThickness = 0.15
  const leadHeight = 0.8

  const componentFullWidth = 4.5
  const leadBodyDistance = (componentFullWidth - _bodyWidth) / 2

  const padContactLength = leadBodyDistance * 0.5

  return (
    <>
      {/* Left leads - positioned at the tip, drawn inwards */}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`left-${i}`}
          position={{
            x: -componentFullWidth / 2,
            y: pinOffsetToCenter - i * _pitch,
            z: leadThickness / 2,
          }}
          width={_leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength + 0.05}
          bodyDistance={leadBodyDistance + 0.1}
          height={leadHeight}
        />
      ))}
      {/* Right leads - positioned at the tip, drawn inwards */}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={`right-${i}`}
          rotation={Math.PI}
          position={{
            x: componentFullWidth / 2,
            y: pinOffsetToCenter - i * _pitch,
            z: leadThickness / 2,
          }}
          width={_leadWidth}
          thickness={leadThickness}
          padContactLength={padContactLength + 0.05}
          bodyDistance={leadBodyDistance + 0.1}
          height={leadHeight}
        />
      ))}
      <ChipBody
        center={{ x: 0, y: 0, z: leadThickness / 2 }}
        width={_bodyWidth}
        length={_bodyLength}
        height={1.0}
      />
    </>
  )
}
