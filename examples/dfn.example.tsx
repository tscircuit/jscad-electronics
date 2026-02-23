import { JsCadView } from "jscad-fiber";
import { ExtrudedPads } from "../lib/ExtrudedPads";
import { DFN } from "lib/dfn";

export default () => {
  const footprint = "dfn8_w5.3mm_p1.27mm";
  return (
    <JsCadView zAxisUp showGrid>
      <DFN num_pins={8} bodyWidth={5.3} bodyLength={5.3} pitch={1.27} />
      <ExtrudedPads footprint={footprint} />
    </JsCadView>
  );
};
