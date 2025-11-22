import { JsCadView } from "jscad-fiber"
import { SOT963 } from "../lib/SOT-963"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOT963 />
      <ExtrudedPads footprint="sot963" />
    </JsCadView>
  )
}
