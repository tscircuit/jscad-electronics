import { JsCadView } from "jscad-fiber";
import { SOD128 } from "../lib/sod-128";
import { ExtrudedPads } from "../lib/ExtrudedPads";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOD128 />
      <ExtrudedPads footprint="sod128" />
    </JsCadView>
  );
};
