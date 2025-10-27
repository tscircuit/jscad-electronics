import { JsCadView } from "jscad-fiber"
import { SOT235 } from "../lib/SOT-235"
import { ExtrudedPads } from "../lib/ExtrudedPads"
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOT235 />
      <ExtrudedPads footprint="sot235" />
    </JsCadView>
  )
}
