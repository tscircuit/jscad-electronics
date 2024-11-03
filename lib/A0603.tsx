import { Cube, Cuboid, Translate, Union } from "jscad-fiber"

// TERMINATORS are the two gray metal boxes on the ends of the resistor
// BODY is the black box middle part

const fullLength = 1.6
const bodyLength = fullLength - 0.3 * 2
const terminatorLength = 0.3
const width = 0.85
const height = 0.6

export const A0603 = ({ color = "#333" }) => {
  return (
    <>
      <Cuboid
        size={[bodyLength, width, height]}
        offset={[0, 0, height / 2]}
        color={color}
      />
      <Cuboid
        size={[terminatorLength, width, height]}
        offset={[fullLength / 2 - terminatorLength / 2, 0, height / 2]}
        color="#ccc"
      />
      <Cuboid
        size={[terminatorLength, width, height]}
        offset={[-fullLength / 2 + terminatorLength / 2, 0, height / 2]}
        color="#ccc"
      />
    </>
  )
}
