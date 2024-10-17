import { Cylinder, Cuboid } from "jscad-fiber"

const buttonRadius = 0.4
const buttonHeight = 0.2

const baseLength = 0.8
const baseWidth = 0.8
const baseHeight = 0.1

const pinRadius = 0.05
const pinHeight = 0.1

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

      <Cylinder
        radius={pinRadius}
        height={pinHeight}
        offset={[-baseLength / 2 + pinRadius, -baseWidth / 2 + pinRadius, 0]}
        color="#000"
      />
      <Cylinder
        radius={pinRadius}
        height={pinHeight}
        offset={[baseLength / 2 - pinRadius, -baseWidth / 2 + pinRadius, 0]}
        color="#000"
      />
      <Cylinder
        radius={pinRadius}
        height={pinHeight}
        offset={[-baseLength / 2 + pinRadius, baseWidth / 2 - pinRadius, 0]}
        color="#000"
      />
      <Cylinder
        radius={pinRadius}
        height={pinHeight}
        offset={[baseLength / 2 - pinRadius, baseWidth / 2 - pinRadius, 0]}
        color="#000"
      />
    </>
  )
}
