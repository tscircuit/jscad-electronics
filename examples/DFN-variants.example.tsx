import { Rotate } from "jscad-fiber"
import { DFN } from "../lib/dfn"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { dfnVariants } from "./fixtures/dfn-variants"
export default Object.fromEntries(
  Object.entries(dfnVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <Rotate rotation={[0, 0, Math.PI]}>
          <DFN {...variant.props} />
        </Rotate>
        <ExtrudedPads footprint={variant.footprint} />
      </>
    </ComponentPreview>,
  ]),
)
