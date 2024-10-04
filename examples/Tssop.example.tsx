import { Colorize, Cylinder, JsCadFixture, Rotate, Sphere } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { SmdChipLead } from "../lib/SmdChipLead"
import { Tssop } from "../lib/Tssop"

// Dimensions are for a na555 IC SOIC package
export default () => {
  return (
    <JsCadFixture zAxisUp>
      <Tssop pinCount={8} pl={0.6} pw={0.2} p={1.27} bodyWidth={4.5} />
      <ExtrudedPads footprint="tssop8_legsoutside_w4.5mm_p1.27mm_pl0.6mm_pw0.2mm" />
    </JsCadFixture>
  )
}
