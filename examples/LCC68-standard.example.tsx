import { LCC68 } from "../lib/LCC68"
import { ComponentPreview } from "./utils/ComponentPreview"
import { lcc68Standard } from "./fixtures/lcc68-standard"

export default {
  "onsemi 115AR LCC68": (
    <ComponentPreview>
      <LCC68 {...lcc68Standard} />
    </ComponentPreview>
  ),
}
