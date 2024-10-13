import { JsCadFixture } from "jscad-fiber"
import { USB_A } from "lib/USB-A"

export default () => {
  return (
    <JsCadFixture zAxisUp showGrid>
      <USB_A />
    </JsCadFixture>
  )
}
