import { JsCadFixture } from "jscad-fiber"
import { SOT563 } from "../lib/SOT-563"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture zAxisUp>
      <SOT563 />
      <ExtrudedPads footprint="sot563" />
    </JsCadFixture>
  )
}
