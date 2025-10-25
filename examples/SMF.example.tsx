import { ExtrudedPads } from "../lib/ExtrudedPads"
import { JsCadView } from "jscad-fiber"
import { SMF } from "../lib/SMF"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SMF />
      <ExtrudedPads footprint="smf" />
    </JsCadView>
  )
}
