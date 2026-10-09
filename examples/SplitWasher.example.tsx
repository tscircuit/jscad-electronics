import { JsCadView } from "jscad-fiber"
import { SplitWasher } from "../lib/models/splitwasher"
export default () => (
  <JsCadView zAxisUp>
    <SplitWasher
      innerDiameter={6.1}
      outerDiameter={11.8}
      thickness={1.6}
      rise={1.6}
      gapAngle={10}
    />
  </JsCadView>
)
