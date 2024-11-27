import { JsCadFixture } from "jscad-fiber"
import { Footprinter3d } from "lib/Footprinter3d"
import { ExtrudedPads } from "lib/ExtrudedPads"

export default () => {
  const footprint = "sot235"
  return (
    <JsCadFixture zAxisUp>
      <Footprinter3d footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </JsCadFixture>
  )
}
