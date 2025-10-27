import { JsCadView } from "jscad-fiber"
import { SOD123F } from "lib/SOD-123F"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOD123F />
      <ExtrudedPads footprint="sod123f" />
    </JsCadView>
  )
}
