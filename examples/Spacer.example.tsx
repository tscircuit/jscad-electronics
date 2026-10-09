import { Spacer } from "../lib/models/spacer"
import { ComponentPreview } from "./utils/ComponentPreview"

export default {
  "3.2 mm bore / 10 mm length / chamfered": (
    <ComponentPreview>
      <Spacer innerDiameter={3.2} outerDiameter={6} length={10} chamfer={0.3} />
    </ComponentPreview>
  ),
  "inch dimensions / square rims": (
    <ComponentPreview>
      <Spacer innerDiameter="0.125in" outerDiameter="0.25in" length="0.5in" />
    </ComponentPreview>
  ),
}
