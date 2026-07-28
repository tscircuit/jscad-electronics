import { JsCadView } from "jscad-fiber"
import { SmdDiode } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <SmdDiode />
    </JsCadView>
  )
}
