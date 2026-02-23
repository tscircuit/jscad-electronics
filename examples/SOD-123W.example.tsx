import { JsCadView } from "jscad-fiber";
import { SOD123W } from "../lib/sod-123W";
import { ExtrudedPads } from "../lib/ExtrudedPads";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SOD123W />
      <ExtrudedPads footprint="sod123w" />
    </JsCadView>
  );
};
