import { Cuboid } from "jscad-fiber"

const fullLength = 2.0
const width = 1.25
const height = 0.55
const terminatorWidth = 0.5

const bodyLength = fullLength - (terminatorWidth * 2)

export const A0805 = () => {
  return (
    <>
      <Cuboid
        size={[bodyLength, height, width]}
        offset={[0, height / 2, 0]}
        color="#333"
      />
      <Cuboid
        size={[terminatorWidth, height, width]}
        offset={[fullLength / 2 - terminatorWidth / 2, height / 2, 0]}
        color="#ccc"
      />
      <Cuboid
        size={[terminatorWidth, height, width]}
        offset={[-fullLength / 2 + terminatorWidth / 2, height / 2, 0]}
        color="#ccc"
      />
    </>
  )
}