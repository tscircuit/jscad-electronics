import { JsCadFixture, Translate, Union } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { AxialResistor } from "../lib/AxialResistor"

export default () => {
  return (
    <JsCadFixture zAxisUp showGrid>
      <AxialResistor pitch={14} />
      <ExtrudedPads footprint="axial_p14mm" />
    </JsCadFixture>
  )
}
