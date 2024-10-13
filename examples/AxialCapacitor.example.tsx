import { JsCadFixture, Translate, Union } from "jscad-fiber"
import { AxialCapacitor } from "../lib/AxialCapacitor"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture zAxisUp showGrid>
      <AxialCapacitor pitch={14} variant="vertical" />
      <ExtrudedPads footprint="axial_p14mm" />
    </JsCadFixture>
  )
}
