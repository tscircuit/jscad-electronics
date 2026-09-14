import { JsCadView } from "jscad-fiber"
import { PowerDI123 } from "../lib/PowerDI123"
import { ExtrudedPads } from "../lib/ExtrudedPads"
const footprint = "diode_p2.3749mm_pw1.725mm_ph1.5mm_rounded0"
export default () => (
  <JsCadView zAxisUp showGrid>
    <PowerDI123 footprint={footprint} />
    <ExtrudedPads footprint={footprint} />
  </JsCadView>
)
