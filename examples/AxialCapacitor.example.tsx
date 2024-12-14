import { JsCadView, Translate, Union } from "jscad-fiber"
import { AxialCapacitor } from "../lib/AxialCapacitor"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <AxialCapacitor pitch={14} variant="vertical" />
      <ExtrudedPads footprint="axial_p14mm" />
    </JsCadView>
  )
}
