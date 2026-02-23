import { JsCadView } from "jscad-fiber";
import { ExtrudedPads } from "../lib/ExtrudedPads";
import { SOD923 } from "lib/SOD-923";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOD923 />
      <ExtrudedPads footprint="sod923" />
    </JsCadView>
  );
};
