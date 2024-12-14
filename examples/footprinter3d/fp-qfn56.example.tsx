import { JsCadView } from "jscad-fiber"
import { Footprinter3d } from "lib/Footprinter3d"
import { ExtrudedPads } from "../../lib/ExtrudedPads"

export default () => {
  const footprint = "qfn56_pw0.2_p0.4_w7.75_h7.75_thermalpad3.2mmx3.2mm"
  return (
    <JsCadView zAxisUp showGrid>
      <Footprinter3d footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </JsCadView>
  )
}
