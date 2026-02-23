import { JsCadView } from "jscad-fiber";
import { A2010 } from "../lib/A2010";
import { ExtrudedPads } from "../lib/ExtrudedPads";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <A2010 />
      <ExtrudedPads footprint="2010" />
    </JsCadView>
  );
};
