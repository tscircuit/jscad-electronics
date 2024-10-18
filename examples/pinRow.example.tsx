import { JsCadFixture } from "jscad-fiber"
import { ExtrudedPads } from "lib/index"
import { PinRow } from "lib/Pinrow"
import { fp } from "@tscircuit/footprinter/dist/index"
export default () => {
  console.log(fp.string("pinrow10").json())
  return (
    <JsCadFixture zAxisUp showGrid>
      <ExtrudedPads footprint="pinrow10_id0.3mm_p1mm_od0.4mm" />
      <PinRow numberOfPins={10} pinDiameter={0.3} pitch={1} pinHeight={5} />
    </JsCadFixture>
  )
}
