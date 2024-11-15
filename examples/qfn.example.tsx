import { JsCadFixture } from "jscad-fiber"
import { QFN } from "../lib/qfn"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { fp } from "@tscircuit/footprinter"

export default () => {
  const footprint = "qfn24_w8_h8_thermalpad3.2mmx3.2mm"
  return (
    <JsCadFixture zAxisUp showGrid>
      <QFN
        num_pins={24}
        bodyWidth={8}
        bodyLength={8}
        thermalPadSize={{
          width: 3.2,
          length: 3.2,
        }}
      />
      <ExtrudedPads footprint={footprint} />
    </JsCadFixture>
  )
}
