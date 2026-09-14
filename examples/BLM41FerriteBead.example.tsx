import { JsCadView } from "jscad-fiber"
import { BLM41FerriteBead } from "../lib/BLM41FerriteBead"
import { ExtrudedPads } from "../lib/ExtrudedPads"

const footprint = "smdpads2_p3.8999mm_pw2mm_ph2mm"
export default () => (
  <JsCadView zAxisUp showGrid>
    <BLM41FerriteBead footprint={footprint} />
    <ExtrudedPads footprint={footprint} />
  </JsCadView>
)
