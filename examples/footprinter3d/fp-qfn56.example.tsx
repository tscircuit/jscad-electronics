import { JsCadFixture } from "jscad-fiber"
import { Footprinter3d } from "lib/Footprinter3d"
import { ExtrudedPads } from "../../lib/ExtrudedPads"
import { fp } from "@tscircuit/footprinter"

export default () => {
  const footprint = "qfn56_pw0.2_p0.4_w7.75_h7.75_thermalpad3.2mmx3.2mm"
  const fpJson = fp.string(footprint).json()
  console.log(fpJson)
  return (
    <JsCadFixture zAxisUp showGrid>
      <Footprinter3d footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </JsCadFixture>
  )
}
