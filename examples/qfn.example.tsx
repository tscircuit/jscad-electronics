import { JsCadFixture } from "jscad-fiber";
import { QFN } from "../lib/qfn";
import { ExtrudedPads } from "../src/lib/ExtrudedPads";

export default () => {
  return (
    <JsCadFixture zAxisUp>
      <QFN fullWidth={4} height={0.8} thermalPadSize={2} />
      <ExtrudedPads footprint="qfn16" />
    </JsCadFixture>
  );
};
