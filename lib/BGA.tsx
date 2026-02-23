import { Cuboid, Sphere, Translate, Colorize, Rotate } from "jscad-fiber";
import { fp } from "@tscircuit/footprinter";

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
  footprintString?: string;
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
  footprintString,
}: BGAProps) => {
  const bodyHeight = packageHeight - standoffHeight;
  const bodyOffset = standoffHeight + bodyHeight / 2;
  const ballOffset = -standoffHeight / 2;

  const ballsSoup = footprintString
    ? fp.string(footprintString).circuitJson()
    : null;

  return (
    <>
      {/* Package body */}
      <Translate z={bodyOffset}>
        <Colorize color="#555">
          <Cuboid size={[packageWidth, packageLength, bodyHeight]} />
        </Colorize>
      </Translate>

      {/* Balls via ball parameters */}
      {!footprintString &&
        Array.from({ length: ballRows * ballColumns }).map((_, index) => {
          if (missingBalls.includes(index + 1)) return null;
          const row = Math.floor(index / ballColumns);
          const col = index % ballColumns;
          const x = (col - (ballColumns - 1) / 2) * ballPitch;
          const y = (row - (ballRows - 1) / 2) * ballPitch;
          return (
            <Translate key={index} x={x} y={y} z={ballOffset}>
              <Sphere radius={ballDiameter / 2} />
            </Translate>
          );
        })}

      {/* Balls via footprint string */}
      {ballsSoup &&
        ballsSoup.map((elm, index) => {
          if (elm.type === "pcb_smtpad") {
            return (
              <Translate
                key={index}
                x={(elm as any).x}
                y={(elm as any).y}
                z={ballOffset}
              >
                <Sphere radius={ballDiameter / 2} />
              </Translate>
            );
          }
          return null;
        })}
    </>
  );
};
