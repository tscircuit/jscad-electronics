import { Cube, Cuboid, Translate, Union } from "jscad-fiber"

// TERMINATORS are the two gray metal boxes on the ends of the resistor
// BODY is the black box middle part

const fullLength = 3
const bodyLength = fullLength - 0.5 * 2
const terminatorLength = 0.5
const width = 1.4
const height = 1.2

export const SMA = ({ color = "#333" }) => {
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
