import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "lib/index"
import { MELF } from "lib/MELF"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <ExtrudedPads footprint="melf" />
      <MELF />
    </JsCadView>
  )
}
