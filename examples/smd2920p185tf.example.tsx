import { JsCadView } from "jscad-fiber"
import { Smd2920P185TF } from "../lib/Smd2920P185TF"

export default () => (
  <JsCadView zAxisUp showGrid>
    <Smd2920P185TF />
  </JsCadView>
)
