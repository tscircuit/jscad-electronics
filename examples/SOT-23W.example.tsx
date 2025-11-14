import { JsCadView } from "jscad-fiber"
import { SOT23W } from "../lib/SOT-23W"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOT23W />
      <ExtrudedPads footprint="sot23w" />
    </JsCadView>
  )
}
