import { JsCadView } from "jscad-fiber"
import { JSHZH1_5mm } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <JSHZH1_5mm numPins={4} />
    </JsCadView>
  )
}
