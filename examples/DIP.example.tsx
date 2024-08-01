import { Dip } from "../lib/Dip"
import { JsCadFixture } from "jscad-fiber"
import { ExtrudedPads } from "../src/lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture>
      {/* <DIP /> */}
      <ExtrudedPads footprint="dip8" />
    </JsCadFixture>
  )
}
