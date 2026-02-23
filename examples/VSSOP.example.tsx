import { JsCadView } from "jscad-fiber";
import { VSSOP } from "../lib/VSSOP";
import { ExtrudedPads } from "../lib/ExtrudedPads";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <VSSOP
        pinCount={8}
        pitch={0.65}
        leadWidth={0.5}
        leadLength={1.6}
        bodyWidth={3.06}
        bodyLength={3.14}
      />
      <ExtrudedPads footprint="vssop8" />
    </JsCadView>
  );
};
