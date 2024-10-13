import { JsCadFixture } from "jscad-fiber"
import { QFP } from "../lib/qfp"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture zAxisUp showGrid>
      <QFP pinCount={64} />
      <ExtrudedPads footprint="qfp64" />
    </JsCadFixture>
  )
}
