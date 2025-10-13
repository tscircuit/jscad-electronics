import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "../../lib/ExtrudedPads"
import { Footprinter3d } from "lib/Footprinter3d"

export default () => {
  const fp = "soic12"
  return (
    <JsCadView zAxisUp showGrid>
      <Footprinter3d footprint={fp} />
      <ExtrudedPads footprint={fp} />
    </JsCadView>
  )
}
