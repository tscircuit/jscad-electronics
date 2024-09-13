import { JsCadFixture } from "jscad-fiber"
import { ExtrudedPads } from "../src/lib/ExtrudedPads"
import { Tssop20 } from "../lib/TSSOP-20"


export default () => {
  return (
    <JsCadFixture zAxisUp>
      <Tssop20 pinCount={20} />
      <ExtrudedPads footprint="tssop20_w6.5mm_p0.65mm" />
    </JsCadFixture>
  )
}
