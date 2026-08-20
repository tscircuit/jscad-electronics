import { JsCadView } from "jscad-fiber"
import { FlexScreen } from "../lib/FlexScreen"

export default () => (
  <JsCadView zAxisUp showGrid>
    <FlexScreen
      diagonal={50}
      aspectRatio="16:9"
      orientation="foldedToRightAngleAboveBoard"
      flexCableLength={34}
      flexCableWidth={10}
      conductorCount={10}
    />
  </JsCadView>
)
