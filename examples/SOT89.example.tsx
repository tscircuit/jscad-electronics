import { JsCadView } from "jscad-fiber"
import { SOT89 } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <SOT89 />
    </JsCadView>
  )
}
