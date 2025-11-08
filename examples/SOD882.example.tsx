import { ExtrudedPads } from "../lib/ExtrudedPads"
import { JsCadView } from "jscad-fiber"
import { SOD882 } from "../lib/SOD882"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOD882 />
      <ExtrudedPads footprint="sod882" />
    </JsCadView>
  )
}
