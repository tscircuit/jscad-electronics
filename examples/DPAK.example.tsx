import { JsCadView } from "jscad-fiber"
import { DPAK } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <DPAK />
    </JsCadView>
  )
}
