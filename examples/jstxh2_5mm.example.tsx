import { JsCadView } from "jscad-fiber"
import { JSTXH2_5mm } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <JSTXH2_5mm numPins={4} />
    </JsCadView>
  )
}
