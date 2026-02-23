import { JsCadView } from "jscad-fiber";
import { SOD323F } from "../lib/sod-323F";
import { ExtrudedPads } from "../lib/ExtrudedPads";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOD323F />
      <ExtrudedPads footprint="sod323f" />
    </JsCadView>
  );
};
