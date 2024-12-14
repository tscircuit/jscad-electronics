import { JsCadView } from "jscad-fiber"
import { A0805 } from "../lib/A0805"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <A0805 />
      <ExtrudedPads footprint="0805" />
    </JsCadView>
  )
}
