import { JsCadView } from "jscad-fiber"
import { FlexScreen } from "../lib/FlexScreen"

export default () => (
  <JsCadView zAxisUp showGrid>
    <FlexScreen
      diagonal={50}
      aspectRatio="16:9"
      orientation="foldedToFaceBelowBoard"
      flexCableLength={38}
      flexCableWidth={10}
      conductorCount={10}
      distanceBelowBoard={9}
      foldDistanceFromConnector={8}
      foldOutset={5}
    />
  </JsCadView>
)
