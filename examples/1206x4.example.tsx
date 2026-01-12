import { JsCadView } from "jscad-fiber"
import { Array1206x4 } from "../lib/1206x4"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <Array1206x4 />
      <ExtrudedPads footprint="1206_x4" />
    </JsCadView>
  )
}
