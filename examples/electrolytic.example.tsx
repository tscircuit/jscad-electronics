import { JsCadView } from "jscad-fiber"
import { ExtrudedPads, Footprinter3d } from "../lib"

const footprint = "electrolytic_d10.5mm_p7.5mm"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <Footprinter3d footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </JsCadView>
  )
}
