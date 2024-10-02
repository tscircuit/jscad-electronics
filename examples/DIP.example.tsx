import { Dip } from "../lib/Dip"
import { JsCadFixture } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture zAxisUp showGrid>
      <Dip />
      <ExtrudedPads footprint="dip8_w5.08" />
    </JsCadFixture>
  )
}
