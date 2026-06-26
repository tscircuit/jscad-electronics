import { TO92 } from "lib/index"
import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <TO92 inline />
      <ExtrudedPads footprint="to92_inline" />
    </JsCadView>
  )
}
