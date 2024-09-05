import { JsCadFixture } from "jscad-fiber"
import { A0805 } from "../lib/A0805"
import { ExtrudedPads } from "../src/lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture zAxisUp>
      <A0805 />
      <ExtrudedPads footprint="0805" />
    </JsCadFixture>
  )
}