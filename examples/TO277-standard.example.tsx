import { Translate } from "jscad-fiber"
import { TO277 } from "../lib/TO277"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { ComponentPreview } from "./utils/ComponentPreview"
import { to277StandardVariants } from "./fixtures/to277-standard-variants"
export default Object.fromEntries(
  Object.entries(to277StandardVariants).map(([name, variant]) => [
    name,
    <ComponentPreview>
      <>
        <TO277 {...variant.props} />
        <Translate x={-0.8625}>
          <ExtrudedPads footprint={variant.footprint} />
        </Translate>
      </>
    </ComponentPreview>,
  ]),
)
