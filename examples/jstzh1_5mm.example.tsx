import { JsCadView } from "jscad-fiber"
import { JSTZH1_5mm } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <JSTZH1_5mm numPins={7} />
    </JsCadView>
  )
}
