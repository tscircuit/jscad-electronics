import { Cuboid, Translate, Colorize } from "jscad-fiber"
import { useMemo } from "react"
import { DipPinLeg } from "./DualInlinePackage"

interface USB_AProps {
  outerWidth?: number
  outerHeight?: number
  outerDepth?: number
  metalThickness?: number
  innerHeight?: number
  innerWidth?: number
  innerDepth?: number
  pinDiameter?: number
  numPins?: number
  innerColor?: string
  outerColor?: string
}

export const USB_A = ({
  outerWidth = 12, // Overall width of the connector
  outerHeight = 4.5, // Overall height of the connector
  outerDepth = 14, // Overall depth of the connector
  metalThickness = 0.28, // Thickness of the metal casing
  innerHeight = 2.5, // Height of the plastic part inside
  innerWidth = 10, // Width of the plastic part inside
  innerDepth = 10, // Depth of the plastic part inside
  innerColor = "#0236e0", // Color of the inner part
  outerColor = "#c4c4c4", // Color of the outer part
}: USB_AProps) => {
  // Metal casing (plates for sides, top, bottom, etc.)
  const metalCasing = useMemo(() => {
    const thickness = metalThickness
    const positions = [
      // back side
      {
        x: 0,
        y: outerDepth / 2 - thickness / 2,
        z: outerHeight / 2 + thickness,
        size: [outerWidth, thickness, outerHeight],
      },
      // top plate
      {
        x: 0,
        y: 0,
        z: outerHeight - thickness / 2 + thickness,
        size: [outerWidth, outerDepth, thickness],
      },
      // bottom plate
      {
        x: 0,
        y: 0,
        z: thickness / 2 + thickness,
        size: [outerWidth + metalThickness, outerDepth, thickness],
      },
      // left side
      {
        x: -outerWidth / 2,
        y: 0,
        z: outerHeight / 2 + thickness,
        size: [thickness, outerDepth, outerHeight],
      },
      // right side
      {
        x: outerWidth / 2,
        y: 0,
        z: outerHeight / 2 + thickness,
        size: [thickness, outerDepth, outerHeight],
      },
      // front sides
      {
        x: outerWidth / 2 + thickness * 0.75,
        y: -outerDepth / 2 + thickness / 2,
        z: outerHeight / 2 + thickness,
        size: [thickness * 1.5, thickness, innerHeight],
      },
      {
        x: -outerWidth / 2 - thickness * 0.75,
        y: -outerDepth / 2 + thickness / 2,
        z: outerHeight / 2 + thickness,
        size: [thickness * 1.5, thickness, innerHeight],
      },
      // front top/bottom edges
      {
        x: 0,
        y: -outerDepth / 2 + thickness / 2,
        z: outerHeight + thickness,
        size: [outerWidth - metalThickness * 4, thickness, thickness],
      },
      {
        x: 0,
        y: -outerDepth / 2 + thickness / 2,
        z: thickness,
        size: [outerWidth - metalThickness * 4, thickness, thickness],
      },
    ]

    return positions.map((pos, index) => (
      <Colorize key={index} color={outerColor}>
        <Cuboid
          size={pos.size as [number, number, number]}
          center={{ x: pos.x, y: pos.y, z: pos.z }}
        />
      </Colorize>
    ))
  }, [outerWidth, outerDepth, outerHeight, metalThickness, outerColor])

  // Plastic insert (inner part)
  const innerPlastic = useMemo(() => {
    return (
      <Translate z={(innerHeight - metalThickness) / 2}>
        <Colorize color={innerColor}>
          <Cuboid
            size={[innerWidth, innerDepth, innerHeight]}
            center={{ x: 0, y: 0, z: metalThickness * 3 }}
          />
        </Colorize>
      </Translate>
    )
  }, [innerWidth, innerHeight, innerDepth, metalThickness, innerColor])

  // Pins (outside and inside)
  const pins = useMemo(() => {
    // TODO reposition the pins to match footprint
    const outerPinPositions = [
      { x: -innerWidth / 3, y: innerDepth / 2, z: 0 },
      { x: -innerWidth / 9, y: innerDepth / 2, z: 0 },
      { x: innerWidth / 3, y: innerDepth / 2, z: 0 },
      { x: innerWidth / 9, y: innerDepth / 2, z: 0 },
    ]
    const innerPinPositions = [
      { x: -innerWidth / 3, y: -0.1, z: innerHeight + metalThickness * 2 },
      { x: -innerWidth / 9, y: -0.1, z: innerHeight + metalThickness * 2 },
      { x: innerWidth / 3, y: -0.1, z: innerHeight + metalThickness * 2 },
      { x: innerWidth / 9, y: -0.1, z: innerHeight + metalThickness * 2 },
    ]

    return (
      <>
        {outerPinPositions.map((pos, index) => (
          <Translate key={`outer-${index}`} x={pos.x} y={pos.y} z={pos.z}>
            <Colorize color="#FFD700">
              <Cuboid size={[0.8, 0.2, 4]} />
            </Colorize>
          </Translate>
        ))}
        {innerPinPositions.map((pos, index) => (
          <Translate key={`inner-${index}`} x={pos.x} y={pos.y} z={pos.z}>
            <Colorize color="#efbf04">
              <Cuboid size={[1, innerDepth, 1]} />
            </Colorize>
          </Translate>
        ))}
      </>
    )
  }, [innerWidth, innerDepth, innerHeight, metalThickness])

  // Side legs
  const legs = useMemo(() => {
    return (
      <>
        <DipPinLeg
          x={-outerWidth / 2}
          y={outerDepth / 4}
          z={outerHeight / 2 - 0.55}
        />
        <DipPinLeg
          x={outerWidth / 2}
          y={outerDepth / 4}
          z={outerHeight / 2 - 0.55}
        />
      </>
    )
  }, [outerWidth, outerDepth, outerHeight])

  // Outer plate
  const outerPlate = useMemo(() => {
    const thickness = 0.2
    return (
      <Cuboid
        color={innerColor}
        center={{ x: 0, y: outerDepth / 4, z: thickness }}
        size={[outerWidth, innerDepth / 1.6, thickness]}
      />
    )
  }, [innerColor, outerWidth, outerDepth, innerDepth])

  return (
    <>
      {metalCasing}
      {innerPlastic}
      {pins}
      {legs}
      {outerPlate}
    </>
  )
}
