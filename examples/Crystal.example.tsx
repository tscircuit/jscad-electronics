import { JsCadView } from "jscad-fiber"
import { Crystal } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <Crystal />
    </JsCadView>
  )
}
