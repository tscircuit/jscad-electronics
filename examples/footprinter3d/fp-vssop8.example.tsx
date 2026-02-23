import { JsCadView } from "jscad-fiber";
import { Footprinter3d } from "lib/Footprinter3d";
import { ExtrudedPads } from "lib/ExtrudedPads";

const footprint = "vssop8";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <Footprinter3d footprint={footprint} />
      <ExtrudedPads footprint={footprint} />
    </JsCadView>
  );
};
