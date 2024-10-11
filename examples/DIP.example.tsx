import { Dip } from "../lib/DualInlinePackage"
import { JsCadFixture } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture zAxisUp showGrid>
      <Dip />
      <ExtrudedPads footprint="dip8" />
    </JsCadFixture>
  )
}
