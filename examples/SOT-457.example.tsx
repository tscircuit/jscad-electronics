import { JsCadView } from "jscad-fiber";
import { SOT457 } from "../lib/SOT-457";
import { ExtrudedPads } from "../lib/ExtrudedPads";
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOT457 />
      <ExtrudedPads footprint="sot457" />
    </JsCadView>
  );
};
