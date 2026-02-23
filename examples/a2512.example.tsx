import { JsCadView } from "jscad-fiber";
import { A2512 } from "../lib/A2512";
import { ExtrudedPads } from "../lib/ExtrudedPads";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <A2512 />
      <ExtrudedPads footprint="2512" />
    </JsCadView>
  );
};
