import { JsCadView } from "jscad-fiber"
import { LED5050 } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <LED5050 />
    </JsCadView>
  )
}
