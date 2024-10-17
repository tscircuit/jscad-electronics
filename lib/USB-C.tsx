import {
  Cuboid,
  Translate,
  Colorize,
  Cylinder,
  Ellipsoid,
  Rotate,
  Subtract,
} from "jscad-fiber"
import { useMemo } from "react"

interface USB_CProps {
  outerWidth?: number
  outerHeight?: number
  outerDepth?: number
  metalThickness?: number
  innerHeight?: number
  innerWidth?: number
  innerDepth?: number
  innerPinsWidth?: number
  innerPinsHeight?: number
  innerPinsDepth?: number
  numOfInnerPins?: number
  innerPinsGap?: number
  outerPinsWidth?: number
  outerPinsThickness?: number
  outerPinsDepth?: number
  pinColor?: string
  innerColor?: string
  outerColor?: string
  sideLegColor?: string
  numOfConnectors?: number
}

export const USB_C = ({
  outerWidth = 8.64, // Standard USB-C connector width
  outerHeight = 2.56, // Standard USB-C height
  outerDepth = 7.35, // Depth of the connector
  metalThickness = 0.2, // Thinner metal casing for better scaling
  innerHeight = 0.7, // Inner part slightly thinner
  innerWidth = 7.0, // Inner width reduced for better proportion
  innerDepth = 5.5, // Inner depth matching the connector
  innerPinsWidth = 0.3, // Narrower pin width
  innerPinsHeight = 0.2, // Thinner pins for a sleeker look
  innerPinsDepth = innerDepth * 0.8, // Reduce the depth so the pins don't protrude out
  innerPinsGap = 0.2, // Reduce the gap for better alignment
  numOfInnerPins = 24, // Number of pins (top or bottom row)
  outerPinsWidth = 0.3,
  outerPinsThickness = 0.1,
  outerPinsDepth = 0.9,
  pinColor = "#FFD700", // Gold-colored pins
  innerColor = "#000000", // Black inner plastic
  outerColor = "#c4c4c4", // Metal casing color
  sideLegColor = "#808080", // Color for side legs
}: USB_CProps) => {
  // Metal casing (main structure)
  const flatMetalCasing = outerWidth - outerWidth / 5
  const metalCasing = useMemo(() => {
    const positions = [
      // Backplate
      {
        plate: "back",
        x: 0,
        y: outerDepth / 2 - 0.2,
        z: outerHeight / 2,
        size: [flatMetalCasing - 0.1, metalThickness, outerHeight - 0.1],
      },
      // Top plate
      {
        plate: "top",
        x: 0,
        y: 0,
        z: outerHeight - metalThickness / 2,
        size: [flatMetalCasing, outerDepth, metalThickness],
      },
      // Bottom plate
      {
        plate: "bottom",
        x: 0,
        y: 0,
        z: metalThickness / 2,
        size: [flatMetalCasing, outerDepth, metalThickness],
      },
    ]

    return positions.map((pos, index) => (
      <Colorize
        key={index}
        color={pos.plate === "back" ? innerColor : outerColor}
      >
        <Cuboid
          size={pos.size as [number, number, number]}
          center={{ x: pos.x, y: pos.y, z: pos.z }}
        />
      </Colorize>
    ))
  }, [outerWidth, outerDepth, outerHeight, metalThickness, outerColor])
  const curvedSides = useMemo(() => {
    const positions = [
      {
        x: outerWidth / 3 + metalThickness * 2,
        y: 0,
        z: outerHeight / 2,
      },
      {
        x: -outerWidth / 3 - metalThickness * 2,
        y: 0,
        z: outerHeight / 2,
      },
    ]
    return positions.map((pos, index) => (
      <Subtract color={outerColor}>
        <Cylinder
          rotation={[Math.PI / 2, 0, 0]}
          key={index}
          color={outerColor}
          center={[pos.x, pos.y, pos.z]}
          radius={outerHeight / 2}
          height={outerDepth}
        />
        <Cylinder
          rotation={[Math.PI / 2, 0, 0]}
          key={index + 1}
          color={"#c4c4c4"}
          center={[
            pos.x > 0
              ? pos.x - metalThickness * 1.5
              : pos.x + metalThickness * 1.5,
            pos.y,
            pos.z,
          ]}
          radius={outerHeight / 2 - metalThickness / 3}
          height={outerDepth}
        />
      </Subtract>
    ))
  }, [outerWidth, outerDepth, outerHeight, metalThickness, outerColor])

  const backOuterSidePlate = useMemo(() => {
    const positions = [
      {
        center: {
          x: flatMetalCasing / 2,
          y: outerDepth / 2 - metalThickness,
          z: outerHeight / 2,
        },
        radius: [flatMetalCasing / 8, metalThickness, outerWidth / 8],
      },
      {
        center: {
          x: -flatMetalCasing / 2,
          y: outerDepth / 2 - metalThickness,
          z: outerHeight / 2,
        },
        radius: [flatMetalCasing / 8, metalThickness, outerWidth / 8],
      },
    ]
    return positions.map((pos, index) => (
      <Ellipsoid
        key={index}
        color="#000000"
        center={pos.center}
        radius={pos.radius as [number, number, number]}
      />
    ))
  }, [outerWidth, outerHeight, outerDepth, metalThickness, outerColor])

  // Plastic inner body (smaller to fit the metal casing)
  const innerPlastic = useMemo(() => {
    return (
      <Colorize color={innerColor}>
        <Cuboid
          size={[innerWidth, innerDepth, innerHeight]}
          center={{ x: 0, y: -0.25, z: outerHeight / 2 }}
        />
      </Colorize>
    )
  }, [innerWidth, innerHeight, innerDepth, metalThickness, innerColor])

  // Pins (adjusting position and ensuring proper placement)
  const innerPins = useMemo(() => {
    const innerPinsPosition = Array.from(
      { length: numOfInnerPins },
      (_, i) => ({
        x:
          i < numOfInnerPins / 2
            ? -innerWidth / 2 +
              innerPinsWidth / 2 +
              (i + 1) * (innerPinsWidth + innerPinsGap)
            : -innerWidth / 2 +
              innerPinsWidth / 2 +
              (i - numOfInnerPins / 2 + 1) * (innerPinsWidth + innerPinsGap),
        y: -0.5,
        z:
          i < numOfInnerPins / 2
            ? outerHeight / 2 - innerPinsHeight - 0.2
            : outerHeight / 2 + innerPinsHeight + 0.2,
      }),
    )

    return innerPinsPosition.map((pos, index) => (
      <Translate key={`pin-${index}`} x={pos.x} y={pos.y} z={pos.z}>
        <Colorize color={pinColor}>
          <Cuboid size={[innerPinsWidth, innerPinsDepth, innerPinsHeight]} />
        </Colorize>
      </Translate>
    ))
  }, [
    numOfInnerPins,
    innerPinsWidth,
    innerPinsDepth,
    innerPinsHeight,
    innerPinsGap,
    pinColor,
    innerWidth,
    innerHeight,
    innerDepth,
    metalThickness,
  ])

  // Side legs
  const legs = useMemo(() => {
    const legPositions = [
      {
        x: -outerWidth / 2,
        y: outerDepth / 2,
        z: 0,
        width: 1.02,
        height: 1.1 + outerHeight / 3,
        thickness: metalThickness,
      },
      {
        x: outerWidth / 2,
        y: outerDepth / 2,
        z: 0,
        width: 1.02,
        height: 1.1 + outerHeight / 3,
        thickness: metalThickness,
      },
      {
        x: outerWidth / 2,
        y: 1.075,
        z: 0,
        width: 0.8,
        height: 1.1 + outerHeight / 3,
        thickness: metalThickness,
      },
      {
        x: -outerWidth / 2,
        y: 1.075,
        z: 0,
        width: 0.8,
        height: 1.1 + outerHeight / 3,
        thickness: metalThickness,
      },
    ]
    return legPositions.map((pos, index) => (
      <>
        <Cuboid
          color={outerColor}
          key={index}
          center={{ x: pos.x, y: pos.y - pos.width / 2, z: pos.z }}
          size={
            [pos.thickness, pos.width, pos.height] as [number, number, number]
          }
        />
      </>
    ))
  }, [outerWidth, outerDepth, outerHeight, sideLegColor])
  const outerContacts = useMemo(() => {
    const outerContactPositions = []
    // Define the x-offsets based on the image increments
    const xOffsets = [
      0, // First contact
      0.305, // Second contact
      0.61 + 0.205, // Third contact
      0.915 + 0.205, // Fourth contact
      1.22 + 0.41, // Fifth contact
      1.53 + 0.62, // Sixth contact
      1.84 + 0.83, // Seventh contact
      2.15 + 1.04, // Eighth contact
      2.46 + 1.25, // Ninth contact
      2.77 + 1.46, // Tenth contact
      3.08 + 1.67, // Eleventh contact
      3.39 + 1.88, // Twelfth contact
      3.7 + 2.09, // Thirteenth contact
      4.01 + 2.09, // Fourteenth contact
      4.32 + 2.29, // Fifteenth contact
      4.63 + 2.29, // Sixteenth contact
    ]

    for (const xOffset of xOffsets) {
      outerContactPositions.push({
        x: innerWidth / 2 - xOffset,
        y: outerDepth / 2,
        z: 0,
      })
    }
    return outerContactPositions.map((pos, index) => (
      <Cuboid
        key={index}
        size={[outerPinsWidth, outerPinsDepth, outerPinsThickness]}
        center={{ x: pos.x, y: pos.y, z: pos.z }}
        color={pinColor}
      />
    ))
  }, [outerWidth, outerDepth, outerHeight, innerColor])

  const cylinderPins = useMemo(() => {
    const radius = 0.25
    const height = 0.5
    const positions = [
      { x: 2.89, y: innerDepth / 2, z: -height / 2 }, //1
      { x: -2.89, y: innerDepth / 2, z: -height / 2 }, //2
    ]
    return positions.map((pos, index) => (
      <Colorize color={"#c4c4c4"}>
        <Cylinder
          center={{ x: pos.x, y: pos.y, z: pos.z }}
          radius={radius}
          height={height}
        />
      </Colorize>
    ))
  }, [innerWidth, innerHeight, innerDepth, metalThickness, innerColor])
  return (
    <>
      {metalCasing}
      {innerPlastic}
      {innerPins}
      {outerContacts}
      {cylinderPins}
      {backOuterSidePlate}
      {legs}
      {curvedSides}
    </>
  )
}
