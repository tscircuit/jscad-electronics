import { ChipBody } from "./ChipBody";
import { SmdChipLead } from "./SmdChipLead";

export const SOT233P = ({ fullWidth = 2.9, fullLength = 2.8 }) => {
  const bodyWidth = 1.3;
  const bodyLength = 2.9;
  const bodyHeight = 1.1;
  const leadWidth = 0.4;
  const leadThickness = 0.15;
  const leadHeight = 0.95;
  const padContactLength = 0.6;

  return (
    <>
      {/* Leads on the right side (pins 1 and 2) */}
      <SmdChipLead
        key={1}
        rotation={Math.PI}
        position={{
          x: fullWidth / 2,
          y: 0,
          z: -0.95,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={(fullWidth - bodyWidth) / 2}
        height={leadHeight}
      />
      <SmdChipLead
        key={2}
        rotation={Math.PI}
        position={{
          x: fullWidth / 2,
          y: 0,
          z: 0.95,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={(fullWidth - bodyWidth) / 2}
        height={leadHeight}
      />

      {/* Lead on the left side (pin 3) */}
      <SmdChipLead
        key={3}
        position={{
          x: -fullWidth / 2,
          y: 0,
          z: 0,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={(fullWidth - bodyWidth) / 2}
        height={leadHeight}
      />

      {/* Chip Body */}
      <ChipBody
        center={{ x: 0, y: bodyHeight / 2, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
      />
    </>
  );
};

export default SOT233P;