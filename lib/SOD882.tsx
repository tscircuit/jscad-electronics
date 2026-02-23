import { Colorize, Cuboid, Hull, Translate, Union } from "jscad-fiber";

export const SOD882 = () => {
  const bodyLength = 0.98;
  const bodyHeight = 0.47;
  const pitch = 0.65;

  const padWidth = 0.51;
  const padLength = 0.26;
  const padThickness = 0.12;

  const bodyWidth = 0.58;
  const leftPadCenterX = -pitch / 2;
  const rightPadCenterX = pitch / 2;

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
        <Translate z={bodyHeight / 2 + 0.02}>
          <Cuboid size={[bodyLength, bodyWidth, bodyHeight]} />
        </Translate>
      </Colorize>

      <Cuboid
        color="#ccc"
        size={[bodyLength + 0.001, padLength / 2, padLength / 4]}
        center={[0, padLength / 2, bodyHeight / 4]}
      />
      <Cuboid
        color="#ccc"
        size={[bodyLength + 0.001, padLength / 2, padLength / 4]}
        center={[0, -padLength / 2, bodyHeight / 4]}
      />

      <Cuboid
        color="#ccc"
        size={[padLength / 1.5, bodyWidth + 0.001, padLength / 4]}
        center={[pitch / 2, 0, bodyHeight / 4]}
      />
      <Cuboid
        color="#ccc"
        size={[padLength / 1.5, bodyWidth + 0.001, padLength / 4]}
        center={[-pitch / 2, 0, bodyHeight / 4]}
      />
    </>
  );
};

export default SOD882;
