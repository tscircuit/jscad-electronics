import { JsCadView } from "jscad-fiber"
import { ElectrolyticCapacitor } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <ElectrolyticCapacitor />
    </JsCadView>
  )
}
