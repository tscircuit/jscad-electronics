import { JsCadView } from "jscad-fiber"
import { ExtrudedPads, Led5050 } from "../lib"

export default () => (
  <JsCadView zAxisUp showGrid>
    <Led5050 />
    <ExtrudedPads footprint="led5050" />
  </JsCadView>
)
