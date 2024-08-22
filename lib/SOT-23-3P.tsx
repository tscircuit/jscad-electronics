import { Cuboid, Translate } from "jscad-fiber";
import { SmdChipLead } from "./SmdChipLead";

const BODY_LENGTH = 2.92;
const BODY_WIDTH = 1.3;
const BODY_HEIGHT = 0.95;
const PIN_WIDTH = 0.45;
const PIN_LENGTH = 1.0;
const LEAD_SPACING = 2.37;

export const SOT233P = () => {
  return (
    <>
      <Cuboid
        size={[BODY_LENGTH, BODY_WIDTH, BODY_HEIGHT]}
        offset={[0, BODY_HEIGHT / 2, 0]}
        color="#333"
      />

      <Translate
        offset={[-BODY_LENGTH / 2 + PIN_WIDTH / 2, -BODY_HEIGHT / 2, 0]}
      >
        <SmdChipLead
          width={PIN_WIDTH}
          thickness={0.15}
          padContactLength={0.6}
          bodyDistance={(LEAD_SPACING - BODY_WIDTH) / 2}
          height={PIN_LENGTH}
        />
      </Translate>

      <Translate offset={[0, -BODY_HEIGHT / 2, 0]}>
        <SmdChipLead
          width={PIN_WIDTH}
          thickness={0.15}
          padContactLength={0.6}
          bodyDistance={(LEAD_SPACING - BODY_WIDTH) / 2}
          height={PIN_LENGTH}
        />
      </Translate>

      <Translate
        offset={[BODY_LENGTH / 2 - PIN_WIDTH / 2, -BODY_HEIGHT / 2, 0]}
      >
        <SmdChipLead
          width={PIN_WIDTH}
          thickness={0.15}
          padContactLength={0.6}
          bodyDistance={(LEAD_SPACING - BODY_WIDTH) / 2}
          height={PIN_LENGTH}
        />
      </Translate>
    </>
  );
};
