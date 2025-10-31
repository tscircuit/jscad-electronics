import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { SOT323 } from "lib/SOT-323"
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOT323 />
      <ExtrudedPads footprint="sot323" />
    </JsCadView>
  )
}
