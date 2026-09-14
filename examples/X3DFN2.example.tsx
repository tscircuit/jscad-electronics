import { JsCadView } from "jscad-fiber"
import { X3DFN2 } from "../lib/X3DFN2"
import { ExtrudedPads } from "../lib/ExtrudedPads"
const footprint = "smdpads2_p0.4mm_pw0.2mm_ph0.3mm"
export default () => (
  <JsCadView zAxisUp showGrid>
    <X3DFN2 footprint={footprint} />
    <ExtrudedPads footprint={footprint} />
  </JsCadView>
)
