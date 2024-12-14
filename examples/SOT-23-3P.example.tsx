import { JsCadView } from "jscad-fiber"
import { SOT233P } from "../lib/SOT-23-3P"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOT233P />
      <ExtrudedPads footprint="sot23" />
    </JsCadView>
  )
}
