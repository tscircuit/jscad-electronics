import { JsCadFixture } from "jscad-fiber"
import { Footprinter3d } from "lib/Footprinter3d"
import { ExtrudedPads } from "lib/ExtrudedPads"
import { fp } from "@tscircuit/footprinter/dist/index"
const footprint = "dip16_wide_p2.54mm"

export default () => {
  return (
    <JsCadFixture zAxisUp showGrid>
      <Footprinter3d footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </JsCadFixture>
  )
}
