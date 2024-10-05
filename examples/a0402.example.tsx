import { JsCadFixture } from "jscad-fiber"
import { A0402 } from "../lib/A0402"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture zAxisUp showGrid>
      <A0402 />
      <ExtrudedPads footprint="0402" />
    </JsCadFixture>
  )
}
