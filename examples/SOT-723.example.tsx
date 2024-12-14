import { SOT723 } from "../lib/SOT-723"
import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOT723 />
      <ExtrudedPads footprint="sot723" />
    </JsCadView>
  )
}
