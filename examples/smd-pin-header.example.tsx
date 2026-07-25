import { JsCadView } from "jscad-fiber"
import { ExtrudedPads, Footprinter3d } from "lib/index"

const footprint = "smdpinheader6_py3.31mm"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <Footprinter3d footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </JsCadView>
  )
}
