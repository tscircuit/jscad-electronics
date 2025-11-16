import { JsCadView } from "jscad-fiber"
import { SOT886 } from "../lib/SOT-886"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOT886 />
      <ExtrudedPads footprint="sot886" />
    </JsCadView>
  )
}
