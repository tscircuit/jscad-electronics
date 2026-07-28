import { JsCadView } from "jscad-fiber"
import { LED2835 } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <LED2835 />
    </JsCadView>
  )
}
