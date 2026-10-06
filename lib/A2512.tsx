import { componentMaterials } from "./materials"
import { Cuboid } from "jscad-fiber"

const fullLength = 6.3
const width = 3.2
const height = 1.8
const terminatorWidth = 0.8

const bodyLength = fullLength - terminatorWidth * 2

export const A2512 = ({ color = "#333" }) => {
  return (
    <>
      <Cuboid
        size={[bodyLength, width, height]}
        offset={[0, 0, height / 2]}
        material={componentMaterials.moldedPlastic}
        color={color}
      />
      <Cuboid
        size={[terminatorWidth, width, height]}
        offset={[fullLength / 2 - terminatorWidth / 2, 0, height / 2]}
        material={componentMaterials.tinnedLead}
        color="#ccc"
      />
      <Cuboid
        size={[terminatorWidth, width, height]}
        offset={[-fullLength / 2 + terminatorWidth / 2, 0, height / 2]}
        material={componentMaterials.tinnedLead}
        color="#ccc"
      />
    </>
  )
}
