import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "lib/index"
import { PinRow } from "lib/PinRow"
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <ExtrudedPads footprint="pinrow6_smd_rightangle_p2.54mm" />
      <PinRow numberOfPins={6} pitch={2.54} smd rightangle />
    </JsCadView>
  )
}
