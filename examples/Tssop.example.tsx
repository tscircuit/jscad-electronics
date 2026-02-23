import { Colorize, Cylinder, JsCadView, Rotate, Sphere } from "jscad-fiber";
import { ExtrudedPads } from "../lib/ExtrudedPads";
import { SmdChipLead } from "../lib/SmdChipLead";
import { Tssop } from "../lib/Tssop";

// Dimensions are for a na555 IC SOIC package
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <Tssop
        pinCount={8}
        leadLength={0.6}
        leadWidth={0.2}
        pitch={1.27}
        bodyWidth={4.5}
      />
      <ExtrudedPads footprint="tssop8_legsoutside_w4.5mm_p1.27mm_pl0.6mm_pw0.2mm" />
    </JsCadView>
  );
};
