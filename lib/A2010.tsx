import { Cuboid } from "jscad-fiber"

const fullLength = 5.0
const width = 2.5
const height = 1.4
const terminatorWidth = 0.6

const bodyLength = fullLength - terminatorWidth * 2

export const A2010 = ({ color = "#333" }) => {
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
