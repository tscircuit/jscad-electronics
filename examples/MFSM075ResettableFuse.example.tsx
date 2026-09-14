import { ComponentPreview } from "./utils/ComponentPreview"
import { MFSM075ResettableFuse } from "../lib/MFSM075ResettableFuse"
import { ExtrudedPads } from "../lib/ExtrudedPads"
const footprint = "smdpads2_p7.0825mm_pw1.5mm_ph3.1mm_cyw9.0852mm_cyh6.1896mm"
export default () => (
  <ComponentPreview>
    <>
      <MFSM075ResettableFuse footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </>
  </ComponentPreview>
)
