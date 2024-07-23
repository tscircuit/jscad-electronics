import { JsCadFixture } from "jscad-fiber"
import { A0402 } from "../lib/A0402"
import { ExtrudedPads } from "../src/lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture>
      <A0402 />
      <ExtrudedPads footprint="0402" />
    </JsCadFixture>
  )
}
