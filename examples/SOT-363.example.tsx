import { JsCadView } from "jscad-fiber";
import { SOT363 } from "../lib/SOT-363";
import { ExtrudedPads } from "../lib/ExtrudedPads";
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOT363 />
      <ExtrudedPads footprint="sot363" />
    </JsCadView>
  );
};
