import { JsCadView } from "jscad-fiber"
import { SOD323FL } from "../lib/sod-323FL"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOD323FL />
      <ExtrudedPads footprint="sod323fl" />
    </JsCadView>
  )
}
