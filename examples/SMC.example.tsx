import { ExtrudedPads } from "../lib/ExtrudedPads";
import { JsCadView } from "jscad-fiber";
import { SMC } from "../lib/SMC";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SMC />
      <ExtrudedPads footprint="smc" />
    </JsCadView>
  );
};
