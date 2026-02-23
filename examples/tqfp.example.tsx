import { JsCadView } from "jscad-fiber";
import { TQFP } from "lib/index";
import { ExtrudedPads } from "../lib/ExtrudedPads";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <TQFP />
      <ExtrudedPads footprint="tqfp64" />
    </JsCadView>
  );
};
