import { ComponentPreview } from "./utils/ComponentPreview"
import { TUMD2SM } from "../lib/TUMD2SM"
import { ExtrudedPads } from "../lib/ExtrudedPads"
const footprint = "smdpads2_p2.1001mm_pw0.8mm_ph1.1mm"
export default () => (
  <ComponentPreview>
    <>
      <TUMD2SM footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </>
  </ComponentPreview>
)
