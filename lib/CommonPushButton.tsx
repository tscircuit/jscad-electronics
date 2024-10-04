import { Cylinder, Cuboid } from "jscad-fiber"

const buttonRadius = 0.4
const buttonHeight = 0.2

const baseLength = 0.8
const baseWidth = 0.8
const baseHeight = 0.1

export const PushButton = () => {
  return (
    <>
      <Cylinder
        radius={buttonRadius}
        height={buttonHeight}
        offset={[0, 0, baseHeight + buttonHeight / 2]}
        color="#555" 
      />

      <Cuboid
        size={[baseLength, baseWidth, baseHeight]}
        offset={[0, 0, baseHeight / 2]}
        color="#ccc"
      />
    </>
  )
}
