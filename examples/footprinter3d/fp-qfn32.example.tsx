import { JsCadView } from "jscad-fiber"
import { Footprinter3d } from "lib/Footprinter3d"
import { ExtrudedPads } from "../../lib/ExtrudedPads"

export default () => {
  const footprint = "qfn32_w5_h5_p0.5mm_thermalpad3.2mmx3.2mm"
  return (
    <JsCadView zAxisUp showGrid>
      <Footprinter3d footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </JsCadView>
  )
}
