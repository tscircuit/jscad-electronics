import { JsCadView } from "jscad-fiber"
import { BGA } from "../lib/BGA"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <BGA footprintString="bga32" />
      <ExtrudedPads footprint="bga32" />
    </JsCadView>
  )
}
