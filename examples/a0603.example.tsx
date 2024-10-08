import { A0603 } from "../lib/A0603"
import { JsCadFixture } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture zAxisUp showGrid>
      <A0603 />
      <ExtrudedPads footprint="0603" />
    </JsCadFixture>
  )
}
