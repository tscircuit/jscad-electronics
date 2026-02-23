import { JsCadView, Translate, Union } from "jscad-fiber";
import { RadialCapacitor } from "../lib/RadialCapacitor";
import { ExtrudedPads } from "../lib/ExtrudedPads";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <RadialCapacitor pitch={14} variant="vertical" />
      <ExtrudedPads footprint="radial_p14mm_id1mm" />
    </JsCadView>
  );
};
