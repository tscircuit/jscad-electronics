import { JsCadFixture } from "jscad-fiber"
import { USB_C } from "lib/USB-C"

export default () => {
  return (
    <JsCadFixture zAxisUp showGrid>
      <USB_C />
    </JsCadFixture>
  )
}
