import { JsCadView, Translate, Union } from "jscad-fiber"
import { AxialLed } from "../lib/AxialLed"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <AxialLed pitch={14} />
      <ExtrudedPads footprint="axial_p14mm" />
    </JsCadView>
  )
}
