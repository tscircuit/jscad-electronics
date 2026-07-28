import { JsCadView } from "jscad-fiber"
import { SmdPushButton } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <SmdPushButton />
    </JsCadView>
  )
}
