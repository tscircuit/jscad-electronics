import { JsCadFixture } from "jscad-fiber"
import { QFP } from "../lib/qfp"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture zAxisUp>
      <QFP pinCount={48} />
      <ExtrudedPads footprint="qfp48" />
    </JsCadFixture>
  )
}
