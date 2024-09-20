import { Cuboid, Sphere, Translate, Colorize, Rotate } from "jscad-fiber";
import { fp } from "@tscircuit/footprinter";
import { useMemo } from "react";

interface FBGAProps {
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

export const FBGA100 = ({
  packageWidth = 5.17,
  packageLength = 5.17,
  packageHeight = 1.2,
  standoffHeight = 0.2,
  ballPitch = 0.5,
  ballDiameter = 0.3,
  ballRows = 10,
  ballColumns = 10,
  missingBalls = [],
  footprintString,
}: FBGAProps) => {
  const bodyHeight = packageHeight - standoffHeight;
  const bodyOffset = 0.6;
  const ballOffset = 0.05;

  const ballsSoup = useMemo(() => {
    if (!footprintString) return null;
    const result = fp.string(footprintString);
    return result.soup();
  }, [footprintString]);

  return (
    <>
      {/* Package body */}
      <Colorize color="#555">
        <Rotate rotation={[(90 / 180) * Math.PI, 0, 0]}>
          <Translate center={[0, 0, -bodyOffset]}>
            <Cuboid
              size={[packageWidth, packageLength, bodyHeight]}
              center={[0, 0, standoffHeight + bodyHeight / 2]}
            />
          </Translate>
        </Rotate>
      </Colorize>

      {/* Balls */}
      {!footprintString &&
        Array.from({ length: ballRows * ballColumns }).map((_, index) => {
          if (missingBalls.includes(index + 1)) return null;

          const row = Math.floor(index / ballColumns);
          const col = index % ballColumns;
          const x = (col - (ballColumns - 1) / 2) * ballPitch;
          const y = (row - (ballRows - 1) / 2) * ballPitch;

          return (
            <Rotate key={index} rotation={[(90 / 180) * Math.PI, 0, 0]}>
              <Translate center={[x, y, -bodyOffset - ballOffset]}>
                <Sphere radius={ballDiameter / 2} />
              </Translate>
            </Rotate>
          );
        })}

      {ballsSoup &&
        ballsSoup.map((elm) => {
          if (elm.type === "pcb_smtpad") {
            return (
              <Rotate
                key={elm.pcb_smtpad_id}
                rotation={[(90 / 180) * Math.PI, 0, 0]}
              >
                <Translate
                  center={[elm.x, elm.y, -bodyOffset - ballOffset]}
                >
                  <Sphere radius={ballDiameter / 2} />
                </Translate>
              </Rotate>
            );
          }
          return null;
        })}
    </>
  );
};

export default FBGA100;