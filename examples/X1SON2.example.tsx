import { JsCadView } from "jscad-fiber"
import { X1SON2 } from "../lib/X1SON2"
import { ExtrudedPads } from "../lib/ExtrudedPads"
const footprint = "smdpads2_p1mm_pw0.6mm_ph0.6mm"
export default () => (
  <JsCadView zAxisUp showGrid>
    <X1SON2 footprint={footprint} />
    <ExtrudedPads footprint={footprint} />
  </JsCadView>
)
