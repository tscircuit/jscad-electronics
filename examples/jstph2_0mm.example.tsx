import { JsCadView } from "jscad-fiber"
import { JSTPH2_0mm } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <JSTPH2_0mm numPins={7} />
    </JsCadView>
  )
}
