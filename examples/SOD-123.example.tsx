import { JsCadView } from "jscad-fiber";
import { SOD123 } from "../lib/sod-123";
import { ExtrudedPads } from "../lib/ExtrudedPads";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOD123 fullWidth={5.0} fullLength={3.1} />
      <ExtrudedPads footprint="sod123" />
    </JsCadView>
  );
};
