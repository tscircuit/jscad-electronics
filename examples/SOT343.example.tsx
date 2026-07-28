import { JsCadView } from "jscad-fiber"
import { SOT343 } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <SOT343 />
    </JsCadView>
  )
}
