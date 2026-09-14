import { fp } from "@tscircuit/footprinter"
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
        <ExtrudedPads
          circuitJson={fp
            .string(variant.footprint)
            .circuitJson()
            .map((p) =>
              p.type === "pcb_smtpad" && p.shape === "rect"
                ? { ...p, x: p.x - 0.8625 }
                : p,
            )}
        />
      </>
    </ComponentPreview>,
  ]),
)
