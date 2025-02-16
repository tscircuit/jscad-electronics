import { JsCadView } from "jscad-fiber"
import { PushButton } from "lib/PushButton"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <PushButton />
      <ExtrudedPads footprint="pushbutton" />
    </JsCadView>
  )
}
