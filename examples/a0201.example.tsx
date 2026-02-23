import { JsCadView } from "jscad-fiber";
import { A0201 } from "../lib/A0201";
import { ExtrudedPads } from "../lib/ExtrudedPads";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <A0201 />
      <ExtrudedPads footprint="0201" />
    </JsCadView>
  );
};
