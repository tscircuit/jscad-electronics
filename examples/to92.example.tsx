import { TO92 } from "lib/index"
import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <TO92 />
      <ExtrudedPads footprint="to92" />
    </JsCadView>
  )
}
