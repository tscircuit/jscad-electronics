import { JsCadFixture } from "jscad-fiber";
import { QFP } from "../lib/qfp";
import { ExtrudedPads } from "../src/lib/ExtrudedPads";

export default () => {
  return (
    <JsCadFixture zAxisUp>
      <QFP pinCount={80} />
      <ExtrudedPads footprint="qfp80" />
    </JsCadFixture>
  );
};
