import { JsCadView } from "jscad-fiber"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  const footprint = "tssop8_w3mm_p0.5mm_pw0.3mm_pl1.45mm"
  return (
    <JsCadView zAxisUp showGrid>
      <Footprinter3d footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </JsCadView>
  )
}
