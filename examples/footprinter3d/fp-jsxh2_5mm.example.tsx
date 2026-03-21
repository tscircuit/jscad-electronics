import { JsCadView } from "jscad-fiber"
import { Footprinter3d } from "lib/Footprinter3d"

const footprint = "jsxh2_5mm4"
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <Footprinter3d footprint={footprint} />
    </JsCadView>
  )
}
