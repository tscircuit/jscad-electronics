import { JsCadFixture } from "jscad-fiber"
import { ExtrudedPads } from "lib/index"
import { PinRow } from "lib/PinRow"
export default () => {
  return (
    <JsCadFixture zAxisUp showGrid>
      <ExtrudedPads footprint="pinrow5_id01mm_p2.54mm_od01.6mm" />
      <PinRow numberOfPins={5} longSidePinLength={6} pitch={2.54} />
    </JsCadFixture>
  )
}
