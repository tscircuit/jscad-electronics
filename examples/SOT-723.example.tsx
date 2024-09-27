import { SOT723 } from "../lib/SOT-723"
import { JsCadFixture } from "jscad-fiber";
import { ExtrudedPads } from "../src/lib/ExtrudedPads";

export default () => {
  return (
    <JsCadFixture zAxisUp>
      <SOT723 />
      <ExtrudedPads footprint="sot723" />
    </JsCadFixture>
  );
};