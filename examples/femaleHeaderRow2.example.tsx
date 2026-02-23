import { JsCadView } from "jscad-fiber";
import { ExtrudedPads, FemaleHeaderRow } from "lib/index";
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <ExtrudedPads footprint="pinrow5_id01mm_p8mm_od4mm_id2mm" />
      <FemaleHeaderRow
        numberOfPins={5}
        legsLength={3}
        innerDiameter={2}
        outerDiameter={4}
        pitch={8}
      />
    </JsCadView>
  );
};
