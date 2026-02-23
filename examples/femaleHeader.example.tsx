import { JsCadView } from "jscad-fiber";
import { FemaleHeader } from "lib/FemaleHeader";
import { ExtrudedPads } from "lib/index";
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <ExtrudedPads footprint="pinrow1_id01mm_p2.54mm_od01.6mm" />
      <FemaleHeader
        x={0}
        y={0}
        legsLength={3}
        innerDiameter={0.945}
        flipZ={(z) => z}
      />
    </JsCadView>
  );
};
