import { JsCadFixture } from "jscad-fiber"
import { ExtrudedPads } from "lib/index"
import { SmdLED } from "lib/smdLED"

export default () => {
  return (
    <JsCadFixture zAxisUp showGrid>
      <ExtrudedPads footprint="0805" />
      <SmdLED footPrintType="0805" color="green" />
    </JsCadFixture>
  )
}
