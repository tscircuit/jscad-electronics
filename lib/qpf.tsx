import React from "react";
import { Translate, Colorize, Cylinder, Rotate } from "jscad-fiber";
import { SmdChipLead, type SmdChipLeadProps } from "./SmdChipLead";
import { ChipBody } from "./ChipBody";

interface QFPProps {
  size: number;
  height: number;
  pinCount: number;
  pinWidth: number;
  pinThickness: number;
  pinLength: number;
  bodyColor?: string;
  pinColor?: string;
}

export const QFP: React.FC<QFPProps> = ({
  size,
  height,
  pinCount,
  pinWidth,
  pinThickness,
  pinLength,
}) => {
  const pinsPerSide = pinCount / 4;
  const pinSpacing = size / pinsPerSide;

  const pinProps: SmdChipLeadProps = {
    thickness: pinThickness,
    width: pinWidth,
    height: height / 2,
    padContactLength: pinLength * 0.4,
    bodyDistance: pinLength,
    curveLength: pinLength * 0.3,
  };

  return (
    <>
      {/* Package body */}
        <ChipBody
          center={{ x: 0, y: 0, z: height / 2 }}
          width={size}
          length={size}
          height={height}
        />

      {/* Pins */}
      {Array.from({ length: pinCount }).map((_, index) => {
        const side = Math.floor(index / pinsPerSide);
        const sideIndex = index % pinsPerSide;
        const pinPosition = sideIndex * pinSpacing - size / 2 + pinSpacing / 2;
        
        const positions = [
          [pinPosition, size / 2 + pinLength / 2, Math.PI],
          [size / 2 + pinLength / 2, -pinPosition, Math.PI * 1.5],
          [-pinPosition, -size / 2 - pinLength / 2, 0],
          [-size / 2 - pinLength / 2, pinPosition, Math.PI * 0.5],
        ];

        const [x, y, rotation] = positions[side] as [number, number, number];

        return (
          <Rotate rotation={[(90 / 180) * Math.PI, 0, 0]}>
            <SmdChipLead
              key={index}
              rotation={rotation}
              position={{ x, y, z: 0 }}
              width={pinWidth}
              thickness={pinThickness}
              padContactLength={pinProps.padContactLength!}
              bodyDistance={pinProps.bodyDistance!}
              height={pinProps.height!}
            />
          </Rotate>
        );
      })}
    </>
  );
};

export default QFP;
