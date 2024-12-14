import { JsCadView } from "jscad-fiber"
import { USB_C } from "lib/USB-C"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <USB_C />
    </JsCadView>
  )
}
