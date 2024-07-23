import { A0402 } from "../lib/A0402"
import { JsCadFixture } from "jscad-fiber"
import { ExtrudedPads } from "../src/lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture>
      {/* <A0603 /> */}
      <ExtrudedPads footprint="0603" />
    </JsCadFixture>
  )
}
