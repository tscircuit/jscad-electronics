import { Cuboid, RoundedCuboid } from "jscad-fiber"

export interface FPCProps {
  pinCount?: number
  pitch?: number
  padWidth?: number
  padLength?: number
  staggered?: boolean
  reverse?: boolean
  rowPitch?: number
  topPadLength?: number
  bottomPadLength?: number
  mountPadPitchX?: number
  mountPadOffsetY?: number
  mountTop?: boolean
  mountPadWidth?: number
  mountPadLength?: number
}

export const FPC = ({
  pinCount = 12,
  pitch = 0.5,
  padWidth = 0.3,
  padLength = 1.25,
  staggered = false,
  reverse = false,
  rowPitch = 2.4,
  topPadLength = padLength,
  bottomPadLength = padLength,
  mountPadPitchX,
  mountPadOffsetY = 2.575,
  mountTop = false,
  mountPadWidth = 2,
  mountPadLength = 2.5,
}: FPCProps) => {
  const contactSpan = Math.max((pinCount - 1) * pitch, pitch)
  const resolvedMountPitch =
    mountPadPitchX ?? contactSpan + (staggered ? 3.5 : 3.38)
  const mountY =
    mountPadOffsetY === 0 ? 0 : (mountTop ? 1 : -1) * mountPadOffsetY
  const contactRowExtent = staggered ? rowPitch / 2 : 0
  const upperPadExtent = contactRowExtent + topPadLength / 2
  const lowerPadExtent = -contactRowExtent - bottomPadLength / 2
  const bodyFront = Math.min(upperPadExtent - 0.15, 0.45)
  const bodyBack = Math.min(
    mountY + mountPadLength * 0.3,
    lowerPadExtent - 0.4,
    bodyFront - 1.8,
  )
  const bodyLength = Math.max(bodyFront - bodyBack, 1.8)
  const bodyCenterY = (bodyFront + bodyBack) / 2
  const bodyWidth = Math.max(
    contactSpan + 1.5,
    resolvedMountPitch + mountPadWidth * 0.55,
  )
  const baseHeight = 0.28
  const housingHeight = 0.62
  const latchHeight = 0.28
  const contactLength = Math.max(bodyLength * 0.55, 0.8)
  const contactCenterY = bodyFront - contactLength / 2 - 0.12
  const latchLength = Math.min(Math.max(bodyLength * 0.28, 0.55), 1.2)
  const latchCenterY = bodyBack + latchLength / 2 + 0.2
  const contactStartX = -contactSpan / 2
  const pinOneIndex = reverse ? pinCount - 1 : 0
  const pinOneX = contactStartX + pinOneIndex * pitch

  return (
    <>
      {[-1, 1].map((direction) => (
        <Cuboid
          key={direction}
          color="#aeb1b4"
          center={[
            direction * (resolvedMountPitch / 2),
            mountY,
            baseHeight / 4,
          ]}
          size={[mountPadWidth, mountPadLength, baseHeight / 2]}
        />
      ))}
      <RoundedCuboid
        color="#e3dfd1"
        center={[0, bodyCenterY, baseHeight / 2]}
        size={[bodyWidth, bodyLength, baseHeight]}
        roundRadius={0.12}
      />
      <RoundedCuboid
        color="#f1eee4"
        center={[0, bodyCenterY, baseHeight + housingHeight / 2]}
        size={[bodyWidth - 0.22, bodyLength - 0.22, housingHeight]}
        roundRadius={0.12}
      />
      {Array.from({ length: pinCount }, (_, index) => (
        <Cuboid
          key={index}
          color={index === pinOneIndex ? "#d4b45a" : "#c8a84e"}
          center={[
            contactStartX + index * pitch,
            contactCenterY,
            baseHeight + housingHeight + 0.025,
          ]}
          size={[Math.max(padWidth * 0.62, 0.08), contactLength, 0.05]}
        />
      ))}
      <RoundedCuboid
        color="#4b4540"
        center={[0, latchCenterY, baseHeight + housingHeight + latchHeight / 2]}
        size={[
          Math.min(bodyWidth - 0.6, contactSpan + 1.25),
          latchLength,
          latchHeight,
        ]}
        roundRadius={0.08}
      />
      <Cuboid
        color="#7c746d"
        center={[
          pinOneX,
          latchCenterY,
          baseHeight + housingHeight + latchHeight + 0.012,
        ]}
        size={[Math.max(padWidth * 0.7, 0.1), latchLength * 0.65, 0.024]}
      />
      <Cuboid
        color="#292a2c"
        center={[0, bodyBack + 0.04, baseHeight + housingHeight * 0.62]}
        size={[contactSpan + pitch, 0.08, housingHeight * 0.45]}
      />
    </>
  )
}
