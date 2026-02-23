import { JsCadView } from "jscad-fiber";
import { ExtrudedPads } from "../lib/ExtrudedPads";
import { MSOP } from "../lib/MSOP";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <MSOP pinCount={8} />
      <ExtrudedPads footprint="msop8_w3.0_p0.65_pl0.45_pw0.2" />
    </JsCadView>
  );
};
