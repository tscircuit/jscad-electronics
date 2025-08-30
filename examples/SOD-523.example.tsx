import { JsCadView } from "jscad-fiber"
import { SOD523 } from "../lib/sod-523"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOD523 />
      <ExtrudedPads footprint="sod523" />
    </JsCadView>
  )
}
