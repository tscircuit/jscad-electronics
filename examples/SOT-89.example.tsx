import { SOT89 } from "../lib/SOT-89"
import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOT89 />
      <ExtrudedPads footprint="sot89" />
    </JsCadView>
  )
}
