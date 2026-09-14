import { ComponentPreview } from "./utils/ComponentPreview"
import { X1SON2 } from "../lib/X1SON2"
import { ExtrudedPads } from "../lib/ExtrudedPads"
const footprint = "smdpads2_p1mm_pw0.6mm_ph0.6mm"
export default () => (
  <ComponentPreview>
    <>
      <X1SON2 footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </>
  </ComponentPreview>
)
