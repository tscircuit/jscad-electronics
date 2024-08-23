import { ChipBody } from "./ChipBody";
import { SmdChipLead } from "./SmdChipLead";

export const SOT233P = () => {
  const fullWidth = 1.25;
  const fullLength = 2.92;

  return (
    <>
      {/* Lead 1 */}
      <SmdChipLead
        key={1}
        position={{
          x: -fullWidth / 2,
          y: 0,
          z: 0,
        }}
        width={0.25}
        thickness={0.15}
        padContactLength={0.6}
        bodyDistance={(1.25 - 0.5) / 2}
        height={0.55}
        curveLength={0.3}
      />

      {/* Lead 2 */}
      <SmdChipLead
        key={2}
        rotation={Math.PI}
        position={{
          x: fullWidth / 2,
          y: 0,
          z: -fullLength / 2 + 0.95,
        }}
        width={0.25}
        thickness={0.15}
        padContactLength={0.6}
        bodyDistance={(1.25 - 0.5) / 2}
        height={0.55}
        curveLength={0.3}
      />

      {/* Lead 3 */}
      <SmdChipLead
        key={3}
        rotation={Math.PI}
        position={{
          x: fullWidth / 2,
          y: 0,
          z: fullLength / 2 - 0.95,
        }}
        width={0.25}
        thickness={0.15}
        padContactLength={0.6}
        bodyDistance={(1.25 - 0.5) / 2}
        height={0.55}
        curveLength={0.3}
      />

      {/* Chip Body */}
      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={fullWidth}
        length={fullLength}
        height={1.52}
      />
    </>
  );
};

export default SOT233P;
