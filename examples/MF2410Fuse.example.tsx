import { ComponentPreview } from "./utils/ComponentPreview"
import { MF2410Fuse } from "../lib/MF2410Fuse"
import { ExtrudedPads } from "../lib/ExtrudedPads"

const footprint = "smdpads2_p4.9997mm_pw2mm_ph3.2mm"
export default () => (
  <ComponentPreview>
    <>
      <MF2410Fuse footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </>
  </ComponentPreview>
)
