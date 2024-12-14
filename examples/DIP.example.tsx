import { Dip } from "../lib/DualInlinePackage"
import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <Dip />
      <ExtrudedPads footprint="dip8" />
    </JsCadView>
  )
}
