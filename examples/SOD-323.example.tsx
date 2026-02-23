import { JsCadView } from "jscad-fiber";
import { SOD323 } from "../lib/sod-323";
import { ExtrudedPads } from "../lib/ExtrudedPads";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOD323 />
      <ExtrudedPads footprint="sod323" />
    </JsCadView>
  );
};
