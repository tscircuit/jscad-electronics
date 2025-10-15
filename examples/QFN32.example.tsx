import { JsCadView } from "jscad-fiber"
import { QFN32 } from "../lib/QFN32"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  const footprint = "qfn32_w5_h5_thermalpad3.2mmx3.2mm"
  return (
    <JsCadView zAxisUp showGrid>
      <QFN32 />
      <ExtrudedPads footprint={footprint} />
    </JsCadView>
  )
}