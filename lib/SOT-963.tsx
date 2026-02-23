import { Cuboid } from "jscad-fiber";
import { ChipBody } from "./ChipBody";

export const SOT963 = () => {
  const bodyWidth = 0.8;
  const bodyLength = 1.0;
  const bodyHeight = 0.37;
  const terminalWidth = 0.15;
  const terminalLength = 0.19;
  const terminalThickness = 0.12;
  const pitch = 0.35;
  const pinsPerSide = 3;
  const pinSpan = pitch * (pinsPerSide - 1);

  return (
    <>
      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyHeight}
        heightAboveSurface={0}
        color="#1a1a1a"
        taperRatio={0.15}
        straightHeightRatio={0}
        notchPosition={{
          x: -bodyWidth / 4,
          y: pinSpan / 2.2,
          z: bodyHeight + 0.1,
        }}
      />

      {[0, 1, 2].map((i) => {
        const y = -pinSpan / 2 + i * pitch;
        return (
          <Cuboid
            key={`left-${i}`}
            center={[
              -bodyWidth / 2 + terminalLength / 2 - 0.1,
              y,
              terminalThickness / 2,
            ]}
            size={[terminalLength, terminalWidth, terminalThickness]}
          />
        );
      })}

      {[0, 1, 2].map((i) => {
        const y = -pinSpan / 2 + i * pitch;
        return (
          <Cuboid
            key={`right-${i}`}
            center={[
              bodyWidth / 2 - terminalLength / 2 + 0.1,
              y,
              terminalThickness / 2,
            ]}
            size={[terminalLength, terminalWidth, terminalThickness]}
          />
        );
      })}
    </>
  );
};

export default SOT963;
