import { JsCadFixture } from "jscad-fiber";
import { QFN } from "../lib/qfn";
import { ExtrudedPads } from "../src/lib/ExtrudedPads";

export default () => {
  return (
    <JsCadFixture zAxisUp>
      <QFN/>
      <ExtrudedPads footprint="qfn16" />
    </JsCadFixture>
  );
};
