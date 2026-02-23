import { Cuboid, Colorize, Translate, Union } from "jscad-fiber";
import { range } from "./utils/range";

export const JST = ({
  numPins = 2,
  pitch = 2.0,
  bodyWidth,
  bodyDepth = 4.5,
  bodyHeight = 6.0,
}: {
  numPins?: number;
  pitch?: number;
  bodyWidth?: number;
  bodyDepth?: number;
  bodyHeight?: number;
}) => {
  const calculatedWidth = bodyWidth ?? (numPins - 1) * pitch + 4.0;
  const zOffset = bodyHeight / 2;

  return (
    <Union>
      {/* Main Connector Body */}
      <Colorize color="#f5f5f5">
        <Cuboid
          size={[calculatedWidth, bodyDepth, bodyHeight]}
          center={[0, 0, zOffset]}
        />
      </Colorize>

      {/* Internal cavity where female connector slides in */}
      <Colorize color="#e0e0e0">
        <Translate offset={[0, -0.5, zOffset + 1]}>
          <Cuboid size={[calculatedWidth - 1.5, bodyDepth - 1.5, bodyHeight]} />
        </Translate>
      </Colorize>

      {/* Polarity / Locking Notch on the back */}
      <Colorize color="#f5f5f5">
        <Translate offset={[0, bodyDepth / 2, zOffset]}>
          <Cuboid size={[calculatedWidth * 0.6, 1, bodyHeight * 0.8]} />
        </Translate>
      </Colorize>

      {/* Pins */}
      <Colorize color="gold">
        {range(numPins).map((i) => {
          const xPos = i * pitch - ((numPins - 1) * pitch) / 2;
          return (
            <Translate key={i} offset={[xPos, 0, 0]}>
              <Cuboid
                size={[0.6, 0.6, bodyHeight + 3]}
                center={[0, 0, (bodyHeight + 3) / 2 - 3.5]}
              />
            </Translate>
          );
        })}
      </Colorize>
    </Union>
  );
};

export default JST;
