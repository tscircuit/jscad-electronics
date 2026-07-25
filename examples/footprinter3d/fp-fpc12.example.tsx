import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "lib/ExtrudedPads"
import { Footprinter3d } from "lib/Footprinter3d"

const footprint = "fpc12"

export default () => (
  <JsCadView zAxisUp showGrid>
    <Footprinter3d footprint={footprint} />
    <ExtrudedPads footprint={footprint} />
  </JsCadView>
)
