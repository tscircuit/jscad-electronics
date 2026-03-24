import { JsCadView } from "jscad-fiber"
import { Footprinter3d } from "lib/Footprinter3d"

const footprint = "jst4_xh"
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <Footprinter3d footprint={footprint} />
    </JsCadView>
  )
}
