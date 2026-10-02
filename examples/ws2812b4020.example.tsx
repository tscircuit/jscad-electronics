import { JsCadView } from "jscad-fiber"
import { Footprinter3d } from "../lib/Footprinter3d"

export default () => (
  <JsCadView zAxisUp showGrid>
    <Footprinter3d
      footprint="smdpads4_pin1location(rightside,top)"
      model="ws2812b4020"
    />
  </JsCadView>
)
