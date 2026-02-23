import { JsCadView } from "jscad-fiber";
import { Footprinter3d } from "lib/Footprinter3d";
import { ExtrudedPads } from "lib/ExtrudedPads";

const footprint = "pinrow6_id01mm_p2.54mm_od01.6mm_female";
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <Footprinter3d footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </JsCadView>
  );
};
