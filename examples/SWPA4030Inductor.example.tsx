import { ComponentPreview } from "./utils/ComponentPreview"
import { SWPA4030Inductor } from "../lib/SWPA4030Inductor"
import { ExtrudedPads } from "../lib/ExtrudedPads"

const footprint = "smdpads2_p3.6002mm_pw1.9mm_ph3.7mm"
export default () => (
  <ComponentPreview>
    <>
      <SWPA4030Inductor footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </>
  </ComponentPreview>
)
