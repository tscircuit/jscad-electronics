import { DFN } from "../dfn"
import { SSOP, type SSOPProps } from "../SSOP"
import { LGA, type LGAProps } from "../LGA"
import { SOT89, type SOT89Props } from "../SOT89"
import { TO277, type TO277Props } from "../TO277"
import { SOIC, type SOICProps } from "../SOIC"
import { MSOP, type MSOPProps } from "../MSOP"
import { Tssop, type TssopProps } from "../Tssop"
import { QFN, type QFNProps } from "../qfn"
import { LQFP, type LQFPProps } from "../lqfp"
import { DO219AD, type DO219ADProps } from "../DO219AD"
import { SOD323HE, type SOD323HEProps } from "../SOD323HE"

/** Explicit physical package selection, separate from the copper footprint.
 * These discriminants are TypeScript API values, never Footprinter tokens.
 * Geometry keeps the standalone component origin/orientation. Use the caller's
 * placement transform when the copper footprint uses another origin or rotation.
 */
export type Footprinter3dModel =
  | { type: "ssop"; props: SSOPProps }
  | { type: "lga"; props: LGAProps }
  | { type: "sot89"; props: SOT89Props }
  | { type: "to277"; props: TO277Props }
  | { type: "soic"; props: SOICProps }
  | { type: "msop"; props: MSOPProps }
  | { type: "tssop"; props: TssopProps }
  | { type: "qfn"; props: QFNProps }
  | { type: "lqfp"; props: LQFPProps }
  | { type: "do219ad"; props: DO219ADProps }
  | { type: "sod323he"; props: SOD323HEProps }
  | { type: "dfn"; props: Parameters<typeof DFN>[0] }
export function renderFootprinter3dModel(model: Footprinter3dModel) {
  switch (model.type) {
    case "ssop":
      return <SSOP {...model.props} />
    case "lga":
      return <LGA {...model.props} />
    case "sot89":
      return <SOT89 {...model.props} />
    case "to277":
      return <TO277 {...model.props} />
    case "soic":
      return <SOIC {...model.props} />
    case "msop":
      return <MSOP {...model.props} />
    case "tssop":
      return <Tssop {...model.props} />
    case "qfn":
      return <QFN {...model.props} />
    case "lqfp":
      return <LQFP {...model.props} />
    case "do219ad":
      return <DO219AD {...model.props} />
    case "sod323he":
      return <SOD323HE {...model.props} />
    case "dfn":
      return <DFN {...model.props} />
    default:
      throw new Error("Unknown explicit Footprinter3d model")
  }
}
