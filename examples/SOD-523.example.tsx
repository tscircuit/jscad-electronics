import { JsCadView } from "jscad-fiber"
import { Footprinter3d } from "lib/Footprinter3d"
import { ExtrudedPads } from "lib/ExtrudedPads"

const footprint = "sod523_w2mm_h1mm_pl0.6mm_pw0.7mm"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <Footprinter3d footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </JsCadView>
  )
}
