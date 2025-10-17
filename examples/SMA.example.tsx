import { JsCadView } from "jscad-fiber"
import { SMA } from "../lib/SMA"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SMA />
      <ExtrudedPads footprint="sma" />
    </JsCadView>
  )
}
