import { JsCadView } from "jscad-fiber"
import { A1206 } from "../lib/A1206"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <A1206 />
      <ExtrudedPads footprint="1206" />
    </JsCadView>
  )
}
