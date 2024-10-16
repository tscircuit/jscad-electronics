import { Cuboid } from "jscad-fiber"

export const SmdLED = ({
  footprint,
  color,
}: {
  footprint: "0402" | "0603" | "0805"
  color?: string
}) => {
  let padWidth: number
  let padLength: number
  let padGap: number
  let padThickness: number
  let bodyLength: number
  let bodyWidth: number

  switch (footprint) {
    case "0402":
      {
        padWidth = 0.6
        padLength = 0.7
        padGap = 0.5
        padThickness = 0.1
        bodyLength = padWidth + padGap * 2
        bodyWidth = padLength
      }
      break
    case "0603":
      {
        padWidth = 0.8
        padLength = 1
        padGap = 0.8
        padThickness = 0.1
        bodyLength = padWidth + padGap * 2
        bodyWidth = padLength
      }
      break
    case "0805":
      {
        padWidth = 1
        padLength = 1.3
        padGap = 1
        padThickness = 0.1
        bodyLength = padWidth + padGap * 2
        bodyWidth = padLength
      }
      break
  }
  return (
    <>
      {/* Left pad */}
      <Cuboid
        color="#383631"
        size={[padWidth, padLength, padThickness]}
        center={[-padGap, 0, padThickness / 2]}
      />
      {/* Right pad */}
      <Cuboid
        color="#383631"
        size={[padWidth, padLength, padThickness]}
        center={[padGap, 0, padThickness / 2]}
      />
      <Cuboid
        color="#fff"
        size={[bodyLength, bodyWidth, padThickness]}
        center={[0, 0, padThickness * 1.5]}
      />

      {/* Plastic colored cube */}
      <Cuboid
        color={color}
        size={[bodyLength / 2, padLength + 0.005, 0.4]}
        center={[0, 0, padThickness * 3.5]}
      />
    </>
  )
}
