import { Cube, Cuboid, Translate, Union } from "jscad-fiber"

// TERMINATORS are the two gray metal boxes on the ends of the resistor
// BODY is the black box middle part

const fullLength = 1.6
const bodyLength = fullLength - 0.3 * 2
const terminatorLength = 0.3
const width = 0.85
const height = 0.6

export const A0603 = () => {
  return (
    <>
      <Cuboid
        size={[bodyLength, height, width]}
        offset={[0, height / 2, 0]}
        color="#333"
      />
      <Cuboid
        size={[terminatorLength, height, width]}
        offset={[fullLength / 2 - terminatorLength / 2, height / 2, 0]}
        color="#ccc"
      />
      <Cuboid
        size={[terminatorLength, height, width]}
        offset={[-fullLength / 2 + terminatorLength / 2, height / 2, 0]}
        color="#ccc"
      />
    </>
  )
}
