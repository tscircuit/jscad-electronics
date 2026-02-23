import { JsCadView } from "jscad-fiber";
import { A01005 } from "../lib/A01005";
import { ExtrudedPads } from "../lib/ExtrudedPads";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <A01005 />
      <ExtrudedPads footprint="01005" />
    </JsCadView>
  );
};
