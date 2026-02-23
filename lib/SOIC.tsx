import { ChipBody } from "./ChipBody";
import { SmdChipLead } from "./SmdChipLead";

// SOIC typical body and lead dimensions
export const SOIC = ({
  pinCount,
  leadLength,
  leadWidth,
  pitch,
  bodyWidth,
}: {
  pinCount: number;
  pitch: number;
  leadWidth: number;
  leadLength: number;
  bodyWidth: number;
}) => {
  const sidePinCount = Math.ceil(pinCount / 2);
  const pinOffsetToCenter = ((sidePinCount - 1) * pitch) / 2;
  const leadThickness = 0.25;
  const bodyHeight = 1.0;
  const leadHeight = 0.8;
  const leadBodyOffset = leadLength * 0;
  const fullLength = pitch * (sidePinCount - 1) + leadWidth + 0.2;
  const bodyWidthAdjusted = bodyWidth * 0.55;

  return (
    <>
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={i}
          position={{
            x: -bodyWidth / 2 - leadBodyOffset,
            y: i * pitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={leadLength / 2}
          bodyDistance={leadLength + 0.3}
          height={leadHeight}
        />
      ))}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={i}
          rotation={Math.PI}
          position={{
            x: bodyWidth / 2 + leadBodyOffset,
            y: i * pitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={leadLength / 2}
          bodyDistance={leadLength + 0.3}
          height={leadHeight}
        />
      ))}
      <ChipBody
        center={{ x: 0, y: 0, z: leadThickness / 2 }}
        width={bodyWidthAdjusted}
        length={fullLength}
        height={bodyHeight}
      />
    </>
  );
};
