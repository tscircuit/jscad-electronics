import { Cuboid, Cylinder, Subtract } from "jscad-fiber";

export const SmdLED = ({
  footprint,
  color,
}: {
  footprint: "0402" | "0603" | "0805";
  color?: string;
}) => {
  let padWidth: number;
  let padLength: number;
  let padGap: number;
  let padThickness: number;
  let bodyLength: number;
  let bodyWidth: number;
  let curvedRadius: number;

  switch (footprint) {
    case "0402":
      {
        padWidth = 0.6;
        padLength = 0.7;
        padGap = 0.5;
        padThickness = 0.05;
        bodyLength = padWidth * 1.5 + padGap * 2;
        bodyWidth = padLength;
        curvedRadius = 0.35;
      }
      break;
    case "0603":
      {
        padWidth = 0.8;
        padLength = 1;
        padGap = 0.8;
        padThickness = 0.05;
        bodyLength = padWidth * 1.5 + padGap * 2;
        bodyWidth = padLength;
        curvedRadius = 0.3;
      }
      break;
    case "0805":
      {
        padWidth = 1;
        padLength = 1.3;
        padGap = 1;
        padThickness = 0.05;
        bodyLength = padWidth * 1.5 + padGap * 2;
        bodyWidth = padLength;
        curvedRadius = 0.4;
      }
      break;
  }
  return (
    <>
      {/* Left pad */}
      <Cuboid
        color="#383631"
        size={[padWidth, padLength, padThickness]}
        center={[-padGap, 0, padThickness / 2]}
      />
      {/* Right pad */}
      <Cuboid
        color="#383631"
        size={[padWidth, padLength, padThickness]}
        center={[padGap, 0, padThickness / 2]}
      />
      <Subtract>
        <Cuboid
          color="#fff"
          size={[bodyLength, bodyWidth, padThickness]}
          center={[0, 0, padThickness * 1.5]}
        />

        <Cylinder
          height={padLength}
          radius={curvedRadius}
          center={[-padWidth * 2, 0, 0]}
        />
        <Cylinder
          height={padLength}
          radius={curvedRadius}
          center={[padWidth * 2, 0, 0]}
        />
      </Subtract>

      {/* Plastic colored cube */}
      <Cuboid
        color={color}
        size={[bodyLength / 2, padLength + 0.005, 0.4]}
        center={[0, 0, padThickness * 5]}
      />
    </>
  );
};
