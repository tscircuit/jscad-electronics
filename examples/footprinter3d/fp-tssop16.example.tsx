import { JsCadFixture } from "jscad-fiber"
import { Footprinter3d } from "lib/Footprinter3d"
import { ExtrudedPads } from "lib/ExtrudedPads"

const footprint = "tssop16"

export default () => {
  return (
    <JsCadFixture zAxisUp>
      <Footprinter3d footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </JsCadFixture>
  )
}
