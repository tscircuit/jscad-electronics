import { Colorize, Cuboid, Hull, Translate, Union } from "jscad-fiber";

export const SMF = () => {
  const fullWidth = 2.9;
  const bodyLength = 1.9;
  const bodyHeight = 1.08;

  const padWidth = 1.2;
  const padLength = 1;
  const padThickness = 0.25;

  const bodyWidth = fullWidth;
  const leftPadCenterX = -1.3;
  const rightPadCenterX = 1.3;

  const taperOffset = 0.2;
  const straightHeight = bodyHeight * 0.5;

  const Body = (
    <Colorize color="#222">
      <Union>
        <Translate z={straightHeight / 2}>
          <Cuboid size={[bodyWidth, bodyLength, straightHeight]} />
        </Translate>

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
  );

  return (
    <>
      <Cuboid
        color="#ccc"
        size={[padLength, padWidth, padThickness]}
        center={[leftPadCenterX, 0, padThickness / 2]}
      />
      <Cuboid
        color="#ccc"
        size={[padLength, padWidth, padThickness]}
        center={[rightPadCenterX, 0, padThickness / 2]}
      />

      {Body}
    </>
  );
};

export default SMF;
