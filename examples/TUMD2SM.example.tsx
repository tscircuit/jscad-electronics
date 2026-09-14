import { JsCadView } from "jscad-fiber"
import { TUMD2SM } from "../lib/TUMD2SM"
import { ExtrudedPads } from "../lib/ExtrudedPads"
const footprint = "smdpads2_p2.1001mm_pw0.8mm_ph1.1mm"
export default () => (
  <JsCadView zAxisUp showGrid>
    <TUMD2SM footprint={footprint} />
    <ExtrudedPads footprint={footprint} />
  </JsCadView>
)
