import { JsCadFixture } from "jscad-fiber";
import { BGA } from "../lib/BGA";
import { ExtrudedPads } from "../src/lib/ExtrudedPads";

export default () => {
  return (
    <JsCadFixture zAxisUp>
        <BGA footprintString="bga100" />
      <ExtrudedPads footprint="bga100" />
    </JsCadFixture>
  );
};
