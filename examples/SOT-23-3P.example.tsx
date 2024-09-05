import { JsCadFixture } from "jscad-fiber";
import { SOT233P } from "../lib/SOT-23-3P";
import { ExtrudedPads } from "../src/lib/ExtrudedPads";

export default () => {
  return (
    <JsCadFixture zAxisUp>
      <SOT233P />
      <ExtrudedPads footprint="sot23" />
    </JsCadFixture>
  );
};
