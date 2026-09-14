import { ComponentPreview } from "./utils/ComponentPreview"
import { B3UTactileSwitch } from "../lib/B3UTactileSwitch"
import { ExtrudedPads } from "../lib/ExtrudedPads"

const footprint = "smdpads2_p3.4mm_pw0.8mm_ph1.7mm"
export default () => (
  <ComponentPreview>
    <>
      <B3UTactileSwitch footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </>
  </ComponentPreview>
)
