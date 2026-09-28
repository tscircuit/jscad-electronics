import { ExtrudedPads } from "../lib/ExtrudedPads"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ComponentPreview } from "./utils/ComponentPreview"

export default Object.fromEntries(
  (["0402", "0603", "0805"] as const).map((size) => [
    `LED ${size}`,
    <ComponentPreview>
      <>
        <Footprinter3d footprint={`led${size}`} />
        <ExtrudedPads footprint={`led${size}`} />
      </>
    </ComponentPreview>,
  ]),
)
