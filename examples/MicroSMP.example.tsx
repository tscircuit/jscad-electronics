import { ComponentPreview } from "./utils/ComponentPreview"
import { MicroSMP } from "../lib/MicroSMP"
import { ExtrudedPads } from "../lib/ExtrudedPads"
const footprint = "smdpads2_p1.84mm_pw1.35mm_ph0.95mm"
export default () => (
  <ComponentPreview>
    <>
      <MicroSMP footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </>
  </ComponentPreview>
)
