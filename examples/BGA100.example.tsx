import { JsCadFixture } from "jscad-fiber";
import { FBGA100 } from "../lib/BGA100";
import { ExtrudedPads } from "../src/lib/ExtrudedPads";

export default () => {
  return (
    <JsCadFixture zAxisUp>
      <FBGA100 />
      {/* <ExtrudedPads footprint="fbga100" /> */}
    </JsCadFixture>
  );
};