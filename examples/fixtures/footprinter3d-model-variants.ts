import type { Footprinter3dModel } from "../../lib/Footprinter3d"
import { ssopStandardVariants } from "./ssop-standard-variants"
import { lgaStandardVariants } from "./lga-standard-variants"
import { sot89StandardVariants } from "./sot89-standard-variants"
import { to277StandardVariants } from "./to277-standard-variants"
export const footprinter3dModelVariants = {
  "SSOP explicit package": {
    footprint: Object.values(ssopStandardVariants)[0]!.footprint,
    model: {
      type: "ssop",
      props: Object.values(ssopStandardVariants)[0]!.props,
    } satisfies Footprinter3dModel,
  },
  "LGA explicit package": {
    footprint: Object.values(lgaStandardVariants)[0]!.footprint,
    model: {
      type: "lga",
      props: Object.values(lgaStandardVariants)[0]!.props,
    } satisfies Footprinter3dModel,
  },
  "SOT89 explicit package": {
    footprint: Object.values(sot89StandardVariants)[0]!.footprint,
    model: {
      type: "sot89",
      props: Object.values(sot89StandardVariants)[0]!.props,
    } satisfies Footprinter3dModel,
  },
  "TO277 explicit package": {
    footprint: Object.values(to277StandardVariants)[0]!.footprint,
    model: {
      type: "to277",
      props: Object.values(to277StandardVariants)[0]!.props,
    } satisfies Footprinter3dModel,
  },
  "SOT89 from standard string": { footprint: "sot89" },
}
