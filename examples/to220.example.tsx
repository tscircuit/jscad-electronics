import { TO220 } from "lib/TO220"
import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <TO220 />
      <ExtrudedPads footprint="to220" />
    </JsCadView>
  )
}
