import { JsCadView } from "jscad-fiber"
import { USB_A } from "lib/USB-A"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <USB_A />
    </JsCadView>
  )
}
