import { JsCadView } from "jscad-fiber";
import { ExtrudedPads } from "../lib/ExtrudedPads";
import { SmdChipLead } from "../lib/SmdChipLead";

// Dimensions are for a na555 IC SOIC package
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SmdChipLead
        width={0.25}
        thickness={0.15}
        padContactLength={0.6}
        bodyDistance={(6.4 - 4.4) / 2}
        height={0.8}
      />
    </JsCadView>
  );
};
