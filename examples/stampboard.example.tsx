import { JsCadView } from "jscad-fiber";
import { ExtrudedPads } from "lib/ExtrudedPads";
import StampBoard from "lib/stampboard";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <StampBoard
        bodyWidth={21}
        leadsTop={3}
        leadsBottom={6}
        leadsLeft={10}
        leadsRight={20}
        innerHoles={true}
      />
      <ExtrudedPads
        footprint={"stampreceiver_left10_right20_bottom6_top3_w21mm_innerhole"}
      />
    </JsCadView>
  );
};
