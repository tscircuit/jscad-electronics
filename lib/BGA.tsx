import { Cuboid, Sphere, Translate, Colorize } from "jscad-fiber";

interface BGAProps {
  packageWidth?: number;
  packageLength?: number;
  packageHeight?: number;
  standoffHeight?: number;
  ballPitch?: number;
  ballDiameter?: number;
  ballRows?: number;
  ballColumns?: number;
  missingBalls?: number[];
}

export const BGA = ({
  packageWidth = 10,
  packageLength = 10,
  packageHeight = 1.2,
  standoffHeight = 0.2,
  ballPitch = 0.8,
  ballDiameter = 0.5,
  ballRows = 8,
  ballColumns = 8,
  missingBalls = [],
}: BGAProps) => {
  const bodyHeight = packageHeight - standoffHeight;

  return (
    <>
      {/* Package body */}
      <Colorize color="#555">
        <Cuboid
          size={[packageWidth, packageLength, bodyHeight]}
          center={[0, 0, standoffHeight + bodyHeight / 2]}
        />
      </Colorize>

      {/* Balls */}
      {Array.from({ length: ballRows * ballColumns }).map((_, index) => {
        if (missingBalls.includes(index + 1)) return null;

        const row = Math.floor(index / ballColumns);
        const col = index % ballColumns;
        const x = (col - (ballColumns - 1) / 2) * ballPitch;
        const y = (row - (ballRows - 1) / 2) * ballPitch;

        return (
          <Translate key={index} center={[x, y, standoffHeight / 2]}>
            <Sphere radius={ballDiameter / 2} />
          </Translate>
        );
      })}
    </>
  );
};
