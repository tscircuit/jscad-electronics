import { JsCadView } from "jscad-fiber";
import { SOD123FL } from "../lib/sod-123FL";
import { ExtrudedPads } from "../lib/ExtrudedPads";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOD123FL />
      <ExtrudedPads footprint="sod123fl" />
    </JsCadView>
  );
};
