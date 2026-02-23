import { JsCadView } from "jscad-fiber";
import { ExtrudedPads } from "../lib/ExtrudedPads";
import { SOT223 } from "lib/SOT-223";
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOT223 />
      <ExtrudedPads footprint="sot223" />
    </JsCadView>
  );
};
