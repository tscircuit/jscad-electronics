import { JsCadFixture } from "jscad-fiber";
import { QFP } from "../lib/qfp80";
import { ExtrudedPads } from "../src/lib/ExtrudedPads";

export default () => {
  return (
    <JsCadFixture zAxisUp>
      <QFP pinCount={80} />
      <ExtrudedPads footprint="qfp80" />
    </JsCadFixture>
  );
};
