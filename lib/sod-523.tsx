import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"

export const SOD523 = ({
  pitch,
  padLength,
  padWidth,
}: {
  pitch?: number | string
  padLength?: number | string
  padWidth?: number | string
}) => {
  const _pitch = !isNaN(parseFloat(pitch as any))
    ? parseFloat(pitch as any)
    : 1.4
  const _padLength = !isNaN(parseFloat(padLength as any))
    ? parseFloat(padLength as any)
    : 0.5
  const _padWidth = !isNaN(parseFloat(padWidth as any))
    ? parseFloat(padWidth as any)
    : 0.6

  const fullWidth = _pitch + _padLength
  const bodyWidth = 1.1
  const bodyLength = 0.6
  const bodyHeight = 0.6
  const leadWidth = _padWidth * 0.5
  const leadThickness = 0.1
  const leadHeight = 0.2
  const padContactLength = _padLength * 0.3
  const bodyDistance = (fullWidth - bodyWidth) / 2
  const padThickness = 0.01
  const padZOffset = _padWidth / 2

  return (
    <>
      {/* Lead on the left side */}
      <SmdChipLead
        key={1}
        position={{
          x: -_pitch / 2 - padContactLength / 2,
          y: 0,
          z: padZOffset,
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
          x: _pitch / 2 + padContactLength / 2,
          y: 0,
          z: padZOffset,
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
        heightAboveSurface={leadHeight + padZOffset}
      />
    </>
  )
}

export default SOD523
