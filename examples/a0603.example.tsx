import { A0603 } from "../lib/A0603";
import { JsCadView } from "jscad-fiber";
import { ExtrudedPads } from "../lib/ExtrudedPads";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <A0603 />
      <ExtrudedPads footprint="0603" />
    </JsCadView>
  );
};
