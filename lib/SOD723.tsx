import { Colorize, Cuboid, Hull, Translate, Union } from "jscad-fiber";

export const SOD723 = () => {
  const fullWidth = 1.4;
  const bodyLength = 0.6;
  const bodyHeight = 0.5;

  const padWidth = 0.28;
  const padLength = 0.5;
  const padThickness = 0.12;

  const bodyWidth = fullWidth - padLength;
  const leftPadCenterX = -bodyWidth / 2 + padLength / 2 - 0.15; // 0.15 is the distance between the pad and the body as datasheet
  const rightPadCenterX = bodyWidth / 2 - padLength / 2 + 0.15; // 0.15 is the distance between the pad and the body as datasheet

  // top taper happens only in last quarter
  const taperOffset = 0.2;
  const straightHeight = bodyHeight * 0.24;

  // Body geometry
  // - straightHeight: the lower (straight) portion of the body
  // - taperOffset: how much smaller the top of the body becomes

  return (
    <>
      {/* Pads */}
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

      {/* Body (lifted above pads) */}
      <Colorize color="#222">
        <Union>
          {/* Straight bottom section */}
          <Translate z={straightHeight / 2}>
            <Cuboid size={[bodyWidth, bodyLength, straightHeight]} />
          </Translate>

          {/* Tapered top quarter */}
          <Hull>
            {/* bottom of taper (same size as straight section top) */}
            <Translate z={straightHeight}>
              <Cuboid size={[bodyWidth, bodyLength, 0.01]} />
            </Translate>

            {/* top of taper (smaller) */}
            <Translate z={bodyHeight}>
              <Cuboid
                size={[bodyWidth - taperOffset, bodyLength - taperOffset, 0.01]}
              />
            </Translate>
          </Hull>
        </Union>
      </Colorize>

      {/* Grey polarity/top strip */}
      <Cuboid
        color="#777"
        size={[fullWidth / 6, bodyLength - taperOffset, 0.02]}
        center={[-bodyWidth / 4, 0, bodyHeight]}
      />
    </>
  );
};

export default SOD723;
