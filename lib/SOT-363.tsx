import { ChipBody } from "./ChipBody";
import { SmdChipLead } from "./SmdChipLead";

export const SOT363 = () => {
  const fullWidth = 2;
  const bodyWidth = 1.25;
  const bodyLength = 2;
  const bodyHeight = 1.1;
  const leadWidth = 0.25;
  const leadThickness = 0.15;
  const leadHeight = 0.85;
  const padContactLength = 0.3;

  // Increase the bodyDistance to extend leads further out
  const extendedBodyDistance = fullWidth - bodyWidth;

  return (
    <>
      {/* Leads on the right side (pins 1 and 2) */}
      <SmdChipLead
        key={1}
        rotation={Math.PI}
        position={{
          x: fullWidth / 2 + extendedBodyDistance / 4,
          y: -0.65,
          z: leadThickness / 2,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={extendedBodyDistance}
        height={leadHeight}
      />
      <SmdChipLead
        key={2}
        rotation={Math.PI}
        position={{
          x: fullWidth / 2 + extendedBodyDistance / 4,
          y: 0,
          z: leadThickness / 2,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={extendedBodyDistance}
        height={leadHeight}
      />

      <SmdChipLead
        key={3}
        rotation={Math.PI}
        position={{
          x: fullWidth / 2 + extendedBodyDistance / 4,
          y: 0.65,
          z: leadThickness / 2,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={extendedBodyDistance}
        height={leadHeight}
      />

      {/* Lead on the left side (pin 3) */}
      <SmdChipLead
        key={3}
        position={{
          x: -fullWidth / 2 - extendedBodyDistance / 4,
          y: 0,
          z: leadThickness / 2,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={extendedBodyDistance}
        height={leadHeight}
      />
      <SmdChipLead
        key={1}
        position={{
          x: -fullWidth / 2 - extendedBodyDistance / 4,
          y: -0.65,
          z: leadThickness / 2,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={extendedBodyDistance}
        height={leadHeight}
      />
      <SmdChipLead
        key={2}
        position={{
          x: -fullWidth / 2 - extendedBodyDistance / 4,
          y: 0.65,
          z: leadThickness / 2,
        }}
        width={leadWidth}
        thickness={leadThickness}
        padContactLength={padContactLength}
        bodyDistance={extendedBodyDistance}
        height={leadHeight}
      />
      {/* Chip Body */}
      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
        straightHeightRatio={0.6}
        notchPosition={{
          x: -(bodyWidth / 2 - 0.25),
          y: bodyHeight / 2 + 0.2,
          z: bodyHeight,
        }}
        heightAboveSurface={0.1}
      />
    </>
  );
};

export default SOT363;
