import { Colorize, Cylinder, JsCadFixture, Rotate, Sphere } from "jscad-fiber"
import { ExtrudedPads } from "../src/lib/ExtrudedPads"
import { SmdChipLead } from "../lib/SmdChipLead"
import { Tssop } from "../lib/Tssop"

// Dimensions are for a na555 IC SOIC package
export default () => {
  return (
    <JsCadFixture zAxisUp>
      <Tssop pinCount={8} />
      <ExtrudedPads footprint="tssop8_legsoutside_p1.27mm" />
    </JsCadFixture>
  )
}
