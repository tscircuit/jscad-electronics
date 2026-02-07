import { JsCadView } from "jscad-fiber"
import { MicroUSB_B } from "lib/MicroUSB-B"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <MicroUSB_B />
    </JsCadView>
  )
}
