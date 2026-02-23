import { Cuboid, Translate, Colorize, Hull, Union } from "jscad-fiber";

export const SOT723 = () => {
  // Body dimensions (mm)
  const bodyWidth = 0.85;
  const bodyLength = 1.2;
  const bodyHeight = 0.38;

  const straightHeight = bodyHeight * 0.55;
  const taperOffset = 0.1;

  const padLength = 0.3;
  const padThickness = 0.1;
  const leftPadWidth = 0.2;
  const rightPadWidth = 0.25;

  const rightPadCenterX = 0.55;
  const rightPadCenterY = 0;

  const leftTopPadCenterX = -0.55;
  const leftTopPadCenterY = 0.4;

  const leftBottomPadCenterX = -0.55;
  const leftBottomPadCenterY = -0.4;

  return (
    <>
      {/* Body with straight lower section + hulled tapered top */}
      <Colorize color="#222">
        <Union>
          {/* straight lower section */}
          <Cuboid
            size={[bodyWidth, bodyLength, straightHeight]}
            center={[0, 0, straightHeight / 2]}
          />

          {/* tapered top via Hull between two thin slices */}
          <Hull>
            <Translate z={straightHeight}>
              <Cuboid size={[bodyWidth, bodyLength, 0.01]} />
            </Translate>
            <Translate z={bodyHeight}>
              <Cuboid
                size={[bodyWidth - taperOffset, bodyLength - taperOffset, 0.01]}
              />
            </Translate>
          </Hull>
        </Union>
      </Colorize>

      {/* Pads */}
      <Cuboid
        color="#ccc"
        size={[padLength, rightPadWidth, padThickness]}
        center={[rightPadCenterX, rightPadCenterY, padThickness / 2]}
      />

      <Cuboid
        color="#ccc"
        size={[padLength, leftPadWidth, padThickness]}
        center={[leftTopPadCenterX, leftTopPadCenterY, padThickness / 2]}
      />

      <Cuboid
        color="#ccc"
        size={[padLength, leftPadWidth, padThickness]}
        center={[leftBottomPadCenterX, leftBottomPadCenterY, padThickness / 2]}
      />
    </>
  );
};

export default SOT723;
