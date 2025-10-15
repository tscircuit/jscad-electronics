import { JsCadView } from "jscad-fiber"
import { QFN } from "../lib/qfn"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { fp } from "@tscircuit/footprinter"

export default () => {
  const footprint = "qfn32_w5_h5_p0.5mm_thermalpad3.2mmx3.2mm"
  return (
    <JsCadView zAxisUp showGrid>
      <QFN
        num_pins={32}
        bodyWidth={5}
        bodyLength={5}
        pitch={0.5}
        padWidth={0.25}
        padLength={0.6}
        thermalPadSize={{
          width: 3.2,
          length: 3.2,
        }}
      />
      <ExtrudedPads footprint={footprint} />
    </JsCadView>
  )
}
