import { Dip } from "../lib/DIP"
import { JsCadFixture } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture zAxisUp>
      {/* <DIP /> */}
      <ExtrudedPads footprint="dip8" />
    </JsCadFixture>
  )
}
