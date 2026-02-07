import { Colorize, Cuboid, Cylinder, Subtract } from "jscad-fiber"

interface MicroUSB_BReceptacleProps {
  outerWidth?: number
  outerHeight?: number
  outerDepth?: number
  metalThickness?: number
  innerWidth?: number
  innerDepth?: number
  innerHeight?: number
  cavityWidth?: number
  cavityHeight?: number
  pinPitch?: number
  pinCount?: number
  pinWidth?: number
  pinHeight?: number
  pinDepth?: number
  innerColor?: string
  outerColor?: string
  pinColor?: string
}

export const MicroUSB_B_Receptacle = ({
  outerWidth = 7.15,
  outerHeight = 2.85,
  outerDepth = 5.55,
  metalThickness = 0.25,
  innerWidth = 5.8,
  innerDepth = 1.15,
  innerHeight = 2.0,
  cavityWidth = 4.5,
  cavityHeight = 1.6,
  pinPitch = 0.65,
  pinCount = 5,
  pinWidth = 0.4,
  pinHeight = 1.15,
  pinDepth = 1.05,
  innerColor = "#1a1a1a",
  outerColor = "#b0b0b0",
  pinColor = "#d4af37",
}: MicroUSB_BReceptacleProps = {}) => {
  const zOffset = outerHeight / 2

  // Main hollow shell with cavity subtracted
  const hollowShell = (
    <Subtract key="hollow-shell">
      {/* Outer shell - main body with rounded side consideration */}
      <Colorize color={outerColor}>
        <Cuboid
          size={[outerWidth, outerDepth, outerHeight]}
          center={{ x: 0, y: 0, z: zOffset }}
        />
      </Colorize>
      {/* Inner cavity - removes the inside */}
      <Cuboid
        size={[innerWidth - 0.5, innerDepth - 0.2, innerHeight - 0.6]}
        center={{ x: 0, y: -outerDepth / 2 + innerDepth * 0.65, z: zOffset }}
      />
      {/* USB opening mouth - front - wider and taller for better visibility */}
      <Cuboid
        size={[cavityWidth + 0.5, outerDepth + 2, cavityHeight + 0.3]}
        center={{ x: 0, y: -outerDepth / 2 + 0.7, z: 0.35 + zOffset }}
      />
    </Subtract>
  )

  // Rounded edge details - left side
  const leftEdgeRound = (
    <Colorize key="left-edge-round" color={outerColor}>
      <Cylinder
        radius={0.35}
        height={outerDepth - 0.4}
        // segments prop removed to satisfy typing in this build
        rotation={[Math.PI / 2, 0, 0]}
        center={[-outerWidth / 2 + 0.35, 0, zOffset]}
      />
    </Colorize>
  )

  // Rounded edge details - right side
  const rightEdgeRound = (
    <Colorize key="right-edge-round" color={outerColor}>
      <Cylinder
        radius={0.35}
        height={outerDepth - 0.4}
        // segments prop removed to satisfy typing in this build
        rotation={[Math.PI / 2, 0, 0]}
        center={[outerWidth / 2 - 0.35, 0, zOffset]}
      />
    </Colorize>
  )

  // Inner black plastic receptacle with pronounced detail
  const innerReceptacle = (
    <Colorize key="inner-receptacle" color={innerColor}>
      <Cuboid
        size={[innerWidth - 0.5, pinDepth - 0.1, innerHeight - 0.7]}
        center={{
          x: 0,
          y: -outerDepth / 2 + innerDepth * 0.7,
          z: 0.6 + zOffset,
        }}
      />
    </Colorize>
  )

  // Front bezel - pronounced frame around opening
  const frontBezel = (
    <Colorize key="front-bezel" color={innerColor}>
      <Cuboid
        size={[outerWidth - 0.5, 0.4, outerHeight - 0.6]}
        center={{ x: 0, y: -outerDepth / 2 + 0.2, z: zOffset }}
      />
    </Colorize>
  )

  // 5 Contact pins - highly prominent and visible from front
  const pins = Array.from({ length: pinCount }).map((_, i) => {
    const offsetFromCenter = (i - (pinCount - 1) / 2) * pinPitch
    const pinY = -outerDepth / 2 + 0.35 // Very close to front
    const pinZ = 0.6 + zOffset // Positioned up

    return (
      <Colorize key={`pin-${i}`} color={pinColor}>
        <Cuboid
          size={[pinWidth + 0.1, pinDepth - 0.1, pinHeight + 0.15]}
          center={{ x: offsetFromCenter, y: pinY, z: pinZ }}
        />
      </Colorize>
    )
  })

  // Top bezel lip
  const topBezelLip = (
    <Colorize key="top-bezel-lip" color={outerColor}>
      <Cuboid
        size={[outerWidth - 0.3, 0.2, 0.25]}
        center={{
          x: 0,
          y: -outerDepth / 2 + 0.15,
          z: outerHeight / 2 - 0.05 + zOffset,
        }}
      />
    </Colorize>
  )

  // Bottom bezel lip
  const bottomBezelLip = (
    <Colorize key="bottom-bezel-lip" color={outerColor}>
      <Cuboid
        size={[outerWidth - 0.3, 0.2, 0.25]}
        center={{
          x: 0,
          y: -outerDepth / 2 + 0.15,
          z: -outerHeight / 2 + 0.05 + zOffset,
        }}
      />
    </Colorize>
  )

  // Side edge chamfer left
  const leftEdgeChamfer = (
    <Colorize key="left-edge-chamfer" color={outerColor}>
      <Cuboid
        size={[0.15, outerDepth - 0.3, outerHeight - 0.2]}
        center={{ x: -outerWidth / 2 - 0.08, y: 0, z: zOffset }}
      />
    </Colorize>
  )

  // Side edge chamfer right
  const rightEdgeChamfer = (
    <Colorize key="right-edge-chamfer" color={outerColor}>
      <Cuboid
        size={[0.15, outerDepth - 0.3, outerHeight - 0.2]}
        center={{ x: outerWidth / 2 + 0.08, y: 0, z: zOffset }}
      />
    </Colorize>
  )

  // Left mounting tab
  const leftTab = (
    <Colorize key="left-tab" color={outerColor}>
      <Cuboid
        size={[0.7, 1.95, 0.35]}
        center={{
          x: -outerWidth / 2 - 0.35,
          y: -outerDepth / 2 + 1.0,
          z: -outerHeight / 2 + 0.17 + zOffset,
        }}
      />
    </Colorize>
  )

  // Right mounting tab
  const rightTab = (
    <Colorize key="right-tab" color={outerColor}>
      <Cuboid
        size={[0.7, 1.95, 0.35]}
        center={{
          x: outerWidth / 2 + 0.35,
          y: -outerDepth / 2 + 1.0,
          z: -outerHeight / 2 + 0.17 + zOffset,
        }}
      />
    </Colorize>
  )

  return (
    <>
      {hollowShell}
      {leftEdgeRound}
      {rightEdgeRound}
      {leftEdgeChamfer}
      {rightEdgeChamfer}
      {innerReceptacle}
      {frontBezel}
      {pins}
      {topBezelLip}
      {bottomBezelLip}
      {leftTab}
      {rightTab}
    </>
  )
}
