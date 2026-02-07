import { JsCadView } from "jscad-fiber"
import { PlatedMountingHole } from "../lib/PlatedMountingHole"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <PlatedMountingHole />
    </JsCadView>
  )
}
