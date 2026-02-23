import { JsCadView } from "jscad-fiber";
import { A1210 } from "../lib/A1210";
import { ExtrudedPads } from "../lib/ExtrudedPads";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <A1210 />
      <ExtrudedPads footprint="1210" />
    </JsCadView>
  );
};
