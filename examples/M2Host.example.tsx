import { JsCadView } from "jscad-fiber"
import { M2Host } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <M2Host />
    </JsCadView>
  )
}
