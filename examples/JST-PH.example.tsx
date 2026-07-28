import { JsCadView } from "jscad-fiber"
import { JST } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <JST numPins={4} series="ph" />
    </JsCadView>
  )
}
