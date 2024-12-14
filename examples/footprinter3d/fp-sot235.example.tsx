import { JsCadView } from "jscad-fiber"
import { Footprinter3d } from "lib/Footprinter3d"
import { ExtrudedPads } from "lib/ExtrudedPads"

export default () => {
  const footprint = "sot235"
  return (
    <JsCadView zAxisUp>
      <Footprinter3d footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </JsCadView>
  )
}
