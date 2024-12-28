import { Cuboid } from "jscad-fiber"

const fullLength = 0.4 // 0.4mm length
const width = 0.2 // 0.2mm width
const height = 0.13 // 0.13mm height
const terminatorWidth = 0.07

const bodyLength = fullLength - terminatorWidth * 2

export const A01005 = ({ color = "#333" }) => {
  return (
    <>
      <Cuboid
        size={[bodyLength, width, height]}
        offset={[0, 0, height / 2]}
        color={color}
      />
      <Cuboid
        size={[terminatorWidth, width, height]}
        offset={[fullLength / 2 - terminatorWidth / 2, 0, height / 2]}
        color="#ccc"
      />
      <Cuboid
        size={[terminatorWidth, width, height]}
        offset={[-fullLength / 2 + terminatorWidth / 2, 0, height / 2]}
        color="#ccc"
      />
    </>
  )
}
