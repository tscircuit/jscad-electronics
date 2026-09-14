import { QFN } from "../lib/qfn"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { qfnPhysicalVariants } from "./fixtures/qfn-physical-variants"
export default Object.fromEntries(
  Object.entries(qfnPhysicalVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <QFN {...variant.props} />
        <ExtrudedPads footprint={variant.footprint} />
      </>
    </ComponentPreview>,
  ]),
)
