import { Rotate } from "jscad-fiber"
import { SOD323HE } from "../lib/SOD323HE"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { sod323heVariants } from "./fixtures/sod323he-variants"
export default Object.fromEntries(
  Object.entries(sod323heVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <Rotate rotation={[0, 0, Math.PI]}>
          <SOD323HE {...variant.props} />
        </Rotate>
        {"footprint" in variant && (
          <ExtrudedPads footprint={variant.footprint} />
        )}
      </>
    </ComponentPreview>,
  ]),
)
