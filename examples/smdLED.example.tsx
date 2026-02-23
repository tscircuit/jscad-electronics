import { JsCadView } from "jscad-fiber";
import { ExtrudedPads } from "lib/index";
import { SmdLED } from "lib/smdLED";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <ExtrudedPads footprint="0805" />
      <SmdLED footprint="0805" color="green" />
    </JsCadView>
  );
};
