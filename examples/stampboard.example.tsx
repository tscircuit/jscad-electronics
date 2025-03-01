import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "lib/ExtrudedPads"
import StampBoard from "lib/stampboard"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <StampBoard
        bodyWidth={21}
        leadsTop={3}
        leadsBottom={3}
        leadsLeft={20}
        leadsRight={20}
        innerHoles={true}
      />
      <ExtrudedPads
        footprint={"stampreceiver_left20_right20_bottom3_top3_w21mm_innerhole"}
      />
    </JsCadView>
  )
}
