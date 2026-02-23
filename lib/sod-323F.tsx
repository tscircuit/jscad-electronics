import { Colorize, Cuboid, Hull, Translate, Union } from "jscad-fiber";
import { ChipBody } from "./ChipBody";

export const SOD323F = () => {
  const fullWidth = 1.7;
  const bodyLength = 1.25;
  const bodyHeight = 0.725;

  const padWidth = 0.325;
  const padLength = 0.4;
  const padThickness = 0.175;

  const leftPadCenterX = -fullWidth / 2 - padLength / 2;
  const rightPadCenterX = fullWidth / 2 + padLength / 2;

  const taperOffset = 0.2;
  const straightHeight = padThickness;

  return (
    <>
      {/* Left pad */}
      <Cuboid
        color="#ccc"
        size={[padLength, padWidth, padThickness]}
        center={[leftPadCenterX, 0, padThickness / 2]}
      />

      {/* Right pad */}
      <Cuboid
        color="#ccc"
        size={[padLength, padWidth, padThickness]}
        center={[rightPadCenterX, 0, padThickness / 2]}
      />

      {/* Body */}
      <Colorize color="#222">
        <Union>
          {/* Middle straight section */}
          <Translate z={straightHeight / 2}>
            <Cuboid size={[fullWidth, bodyLength, straightHeight]} />
          </Translate>

          {/* Top taper section */}
          <Hull>
            <Translate z={straightHeight}>
              <Cuboid size={[fullWidth, bodyLength, 0.01]} />
            </Translate>
            <Translate z={bodyHeight}>
              <Cuboid
                size={[fullWidth - taperOffset, bodyLength - taperOffset, 0.01]}
              />
            </Translate>
          </Hull>
        </Union>
      </Colorize>

      {/* Grey polarity/top strip */}
      <Cuboid
        color="#777"
        size={[fullWidth / 3, bodyLength - taperOffset, 0.02]}
        center={[leftPadCenterX + fullWidth / 4.4 + taperOffset, 0, bodyHeight]}
      />
    </>
  );
};

export default SOD323F;
