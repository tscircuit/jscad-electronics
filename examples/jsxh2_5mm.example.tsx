import { JsCadView } from "jscad-fiber"
import { JSXH2_5mm } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <JSXH2_5mm numPins={4} />
    </JsCadView>
  )
}
