import { JsCadView } from "jscad-fiber"
import { LQFP } from "lib/index"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <LQFP />
      <ExtrudedPads footprint="lqfp64" />
    </JsCadView>
  )
}
