import { JsCadView } from "jscad-fiber";
import { ExtrudedPads } from "lib/index";
import { MINIMELF } from "lib/MINIMELF";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <ExtrudedPads footprint="minimelf" />
      <MINIMELF />
    </JsCadView>
  );
};
