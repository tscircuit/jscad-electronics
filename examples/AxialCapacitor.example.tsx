import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { AxialCapacitor } from "lib/AxialCapacitor"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <AxialCapacitor pitch={14} />
      <ExtrudedPads footprint="axial_p14mm" />
    </JsCadView>
  )
}
