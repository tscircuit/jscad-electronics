import {
  Colorize,
  Cuboid,
  Cylinder,
  Rotate,
  RoundedCuboid,
  Subtract,
  Translate,
} from "jscad-fiber"

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

const HOUSING_COLOR = "#303339"
const HOUSING_SHADOW = "#1f2227"
const ACTUATOR_COLOR = "#eee8d8"
const ACTUATOR_HIGHLIGHT = "#f8f3e7"
const TIN_COLOR = "#b7bdc2"
const TIN_HIGHLIGHT = "#d2d6d9"
const HOLD_DOWN_COLOR = "#767d82"
const HOLD_DOWN_HIGHLIGHT = "#9ba1a5"

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
  const contactStartX = -contactSpan / 2
  const resolvedMountPitch =
    mountPadPitchX ?? contactSpan + (staggered ? 3.5 : 3.38)
  const mountY =
    mountPadOffsetY === 0 ? 0 : (mountTop ? 1 : -1) * mountPadOffsetY

  const contactRows = Array.from({ length: pinCount }, (_, index) => {
    const isUpperRow = staggered && (index % 2 === 1) !== reverse
    const y = staggered ? (isUpperRow ? rowPitch / 2 : -rowPitch / 2) : 0
    const length = isUpperRow ? topPadLength : bottomPadLength
    return {
      index,
      x: contactStartX + index * pitch,
      y,
      length,
    }
  })

  const contactMaxY = Math.max(
    ...contactRows.map((contact) => contact.y + contact.length / 2),
  )
  const contactMinY = Math.min(
    ...contactRows.map((contact) => contact.y - contact.length / 2),
  )
  const mountingMinY = mountY - mountPadLength / 2
  const mountingMaxY = mountY + mountPadLength / 2
  const signalSideY = mountTop ? contactMinY : contactMaxY
  const cableSideY = mountTop
    ? Math.max(mountingMaxY, contactMaxY) + 0.67
    : Math.min(mountingMinY, contactMinY) - 0.67
  const directionToSignal = mountTop ? -1 : 1
  const housingSignalY =
    signalSideY - directionToSignal * Math.max(padLength * 0.86, 1.05)
  const housingCableY = cableSideY + directionToSignal * 0.22
  const housingDepth = Math.abs(housingSignalY - housingCableY)
  const housingCenterY = (housingSignalY + housingCableY) / 2
  const cableEdgeY = housingCableY - directionToSignal * 0.01
  const bodyWidth = Math.max(
    contactSpan + 4.9,
    resolvedMountPitch + mountPadWidth * 0.76,
  )
  const openingWidth = Math.min(bodyWidth - 2.3, contactSpan + 1.1)
  const housingBaseHeight = 0.3
  const housingHeight = 1.42
  const overallHeight = 2
  const throatDepth = Math.min(0.92, housingDepth * 0.28)
  const throatCenterY =
    cableEdgeY + directionToSignal * (throatDepth / 2 - 0.04)
  const throatHeight = 1.6
  const throatCenterZ = 1.1
  const actuatorDepth = Math.max(housingDepth - 0.78, 1.5)
  const actuatorCenterY =
    cableEdgeY + directionToSignal * (actuatorDepth / 2 + 0.68)
  const actuatorWidth = bodyWidth - 0.72
  const actuatorHeight = 0.34
  const actuatorCenterZ = overallHeight - actuatorHeight / 2
  const hingeY =
    cableEdgeY + directionToSignal * Math.min(0.68, housingDepth * 0.22)
  const hingeZ = 1.48
  const terminalWidth = Math.max(padWidth * 0.82, 0.15)
  const terminalOuterY = signalSideY
  const terminalLength = Math.abs(terminalOuterY - housingSignalY)
  const terminalCenterY = (terminalOuterY + housingSignalY) / 2
  const springLength = Math.max(throatDepth * 0.8, 0.5)
  const springCenterY =
    cableEdgeY + directionToSignal * (springLength / 2 + 0.08)
  const endClipX = resolvedMountPitch / 2
  const clipHeight = 0.75
  const clipWallX = bodyWidth / 2 - 0.04
  const clipCapX = bodyWidth / 2 - 0.23
  const sideBossX = bodyWidth / 2 - 0.32
  const sideBossWidth = 0.68

  return (
    <>
      {[-1, 1].map((direction) => (
        <Cuboid
          key={`mount-pad:${direction}`}
          color={TIN_COLOR}
          center={[direction * endClipX, mountY, 0.07]}
          size={[mountPadWidth, mountPadLength, 0.14]}
        />
      ))}

      {contactRows.map((contact) => (
        <Cuboid
          key={`terminal:${contact.index}`}
          color={TIN_COLOR}
          center={[contact.x, terminalCenterY, 0.065]}
          size={[terminalWidth, terminalLength, 0.13]}
        />
      ))}

      <RoundedCuboid
        color={HOUSING_SHADOW}
        center={[0, housingCenterY, housingBaseHeight / 2]}
        size={[bodyWidth, housingDepth, housingBaseHeight]}
        roundRadius={0.1}
      />

      <Colorize color={HOUSING_COLOR}>
        <Subtract>
          <RoundedCuboid
            center={[0, housingCenterY, housingBaseHeight + housingHeight / 2]}
            size={[bodyWidth - 0.2, housingDepth - 0.12, housingHeight]}
            roundRadius={0.14}
          />
          <Cuboid
            center={[0, throatCenterY, throatCenterZ]}
            size={[openingWidth, throatDepth, throatHeight]}
          />
          <Cuboid
            center={[0, actuatorCenterY, overallHeight - actuatorHeight * 0.72]}
            size={[actuatorWidth - 0.32, actuatorDepth - 0.16, actuatorHeight]}
          />
        </Subtract>
      </Colorize>

      {contactRows.map((contact) => (
        <RoundedCuboid
          key={`spring:${contact.index}`}
          color={TIN_HIGHLIGHT}
          center={[contact.x, springCenterY, housingBaseHeight + 0.82]}
          size={[terminalWidth * 0.82, springLength, 0.14]}
          roundRadius={0.035}
        />
      ))}

      {contactRows.map((contact) => (
        <Cuboid
          key={`terminal-rise:${contact.index}`}
          color={TIN_COLOR}
          center={[
            contact.x,
            housingSignalY - directionToSignal * 0.03,
            housingBaseHeight + 0.32,
          ]}
          size={[terminalWidth, 0.13, 0.62]}
        />
      ))}

      <Cuboid
        color={HOUSING_SHADOW}
        center={[
          0,
          cableEdgeY + directionToSignal * 0.1,
          housingBaseHeight + 0.71,
        ]}
        size={[openingWidth + 0.18, 0.16, 0.8]}
      />

      <RoundedCuboid
        color={ACTUATOR_COLOR}
        center={[0, actuatorCenterY, actuatorCenterZ]}
        size={[actuatorWidth, actuatorDepth, actuatorHeight]}
        roundRadius={0.11}
      />

      <Cuboid
        color={ACTUATOR_HIGHLIGHT}
        center={[
          0,
          actuatorCenterY - directionToSignal * (actuatorDepth / 2 - 0.12),
          overallHeight - 0.035,
        ]}
        size={[actuatorWidth - 0.36, 0.24, 0.07]}
      />

      {[-1, 1].map((direction) => (
        <RoundedCuboid
          key={`actuator-ear:${direction}`}
          color={ACTUATOR_COLOR}
          center={[direction * sideBossX, hingeY, hingeZ]}
          size={[sideBossWidth, 0.92, 0.72]}
          roundRadius={0.1}
        />
      ))}

      {[-1, 1].map((direction) => (
        <Translate
          key={`hinge:${direction}`}
          x={direction * sideBossX}
          y={hingeY}
          z={hingeZ}
        >
          <Rotate rotation={[0, Math.PI / 2, 0]}>
            <Cylinder
              color={ACTUATOR_HIGHLIGHT}
              height={sideBossWidth + 0.12}
              radius={0.24}
            />
          </Rotate>
        </Translate>
      ))}

      {[-1, 1].map((direction) => (
        <RoundedCuboid
          key={`hold-down-wall:${direction}`}
          color={HOLD_DOWN_COLOR}
          center={[direction * clipWallX, mountY, clipHeight / 2]}
          size={[0.17, Math.min(mountPadLength * 0.3, 0.7), clipHeight]}
          roundRadius={0.04}
        />
      ))}

      {[-1, 1].map((direction) => (
        <RoundedCuboid
          key={`hold-down-cap:${direction}`}
          color={HOLD_DOWN_HIGHLIGHT}
          center={[direction * clipCapX, mountY, clipHeight - 0.05]}
          size={[0.42, Math.min(mountPadLength * 0.3, 0.7), 0.1]}
          roundRadius={0.035}
        />
      ))}

      <Cuboid
        color={HOUSING_SHADOW}
        center={[0, housingCenterY, 0.025]}
        size={[openingWidth + 0.7, housingDepth * 0.58, 0.05]}
      />

      <Cuboid
        color={HOUSING_SHADOW}
        center={[
          0,
          housingSignalY - directionToSignal * 0.06,
          housingBaseHeight + 0.82,
        ]}
        size={[openingWidth + 0.4, 0.15, 0.92]}
      />
    </>
  )
}
