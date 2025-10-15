import { JsCadView } from "jscad-fiber"
import { QFN32 } from "../lib/QFN32"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <QFN32 />
      <ExtrudedPads footprint="qfn32_w5_h5_p0.5_pw0.25_pl0.75_thermalpad3.1mmx3.1mm" />
    </JsCadView>
  )
}
