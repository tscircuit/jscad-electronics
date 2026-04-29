import { JsCadView } from "jscad-fiber"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <Footprinter3d footprint="qfp64" />
      <ExtrudedPads footprint="qfp64" />
    </JsCadView>
  )
}
