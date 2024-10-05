import { JsCadFixture } from "jscad-fiber"
import { ExtrudedPads } from "../../lib/ExtrudedPads"
import { Footprinter3d } from "lib/Footprinter3d"

export default () => {
  const fp = "tssop20_w4.5mm_p0.65mm_pl0.6mm_pw0.2mm"
  return (
    <JsCadFixture zAxisUp showGrid>
      <Footprinter3d footprint={fp} />
      <ExtrudedPads footprint={fp} />
    </JsCadFixture>
  )
}
