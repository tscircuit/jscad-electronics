import { JsCadView } from "jscad-fiber"
import { Potentiometer } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <Potentiometer />
    </JsCadView>
  )
}
