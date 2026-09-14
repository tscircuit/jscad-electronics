import { JsCadView } from "jscad-fiber"
import { B3UTactileSwitch } from "../lib/B3UTactileSwitch"
import { ExtrudedPads } from "../lib/ExtrudedPads"

const footprint = "smdpads2_p3.4mm_pw0.8mm_ph1.7mm"
export default () => (
  <JsCadView zAxisUp showGrid>
    <B3UTactileSwitch footprint={footprint} />
    <ExtrudedPads footprint={footprint} />
  </JsCadView>
)
