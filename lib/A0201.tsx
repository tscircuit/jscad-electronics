import { componentMaterials } from "./materials"
import { Cuboid } from "jscad-fiber"

const fullLength = 0.6
const width = 0.3
const height = 0.33
const terminatorWidth = 0.1

const bodyLength = fullLength - terminatorWidth * 2

export const A0201 = ({ color = "#333" }) => {
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
