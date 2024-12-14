import { JsCadView, Translate, Union } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { AxialResistor } from "../lib/AxialResistor"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <AxialResistor pitch={14} />
      <ExtrudedPads footprint="axial_p14mm" />
    </JsCadView>
  )
}
