import { JsCadFixture } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { Tssop } from "lib/Tssop"

export default () => {
  return (
    <JsCadFixture zAxisUp>
      <Tssop pinCount={20} />
      <ExtrudedPads footprint="tssop20_w6.5mm_p0.65mm" />
    </JsCadFixture>
  )
}
