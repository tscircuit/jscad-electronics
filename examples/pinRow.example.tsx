import { JsCadFixture } from "jscad-fiber"
import { ExtrudedPads } from "lib/index"
import { PinRow } from "lib/PinRow"
export default () => {
  return (
    <JsCadFixture zAxisUp showGrid>
      <ExtrudedPads footprint="pinrow10_id0.3mm_p1mm_od0.4mm" />
      <PinRow numberOfPins={10} pinDiameter={0.3} pitch={1} pinHeight={5} />
    </JsCadFixture>
  )
}
