import { ExtrudedPads } from "dist"
import { JsCadView } from "jscad-fiber"
import { HC49 } from "lib/hc49"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <HC49 />
      <ExtrudedPads footprint="hc49" />
    </JsCadView>
  )
}
