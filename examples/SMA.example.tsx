import { ExtrudedPads } from "../lib/ExtrudedPads"
import { JsCadView } from "jscad-fiber"
import { SMA } from "../lib/SMA"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SMA />
      <ExtrudedPads footprint="sma" />
    </JsCadView>
  )
}