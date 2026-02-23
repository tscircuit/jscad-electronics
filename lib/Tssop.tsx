import { ChipBody } from "./ChipBody";
import { SmdChipLead } from "./SmdChipLead";

// TODO use mm to convert width to mm (and accept strings)
export const Tssop = ({
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
  const fullLength = (pitch * pinCount) / 2 + leadWidth / 2;
  const pinOffsetToCenter = ((sidePinCount - 1) * pitch) / 2;
  const leadThickness = 0.25;

  return (
    <>
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={i}
          position={{
            x: -bodyWidth / 2 - leadLength,
            y: i * pitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={leadLength}
          bodyDistance={leadLength + 1}
          height={0.8}
        />
      ))}
      {Array.from({ length: sidePinCount }).map((_, i) => (
        <SmdChipLead
          key={i}
          rotation={Math.PI}
          position={{
            x: bodyWidth / 2 + leadLength,
            y: i * pitch - pinOffsetToCenter,
            z: leadThickness / 2,
          }}
          width={leadWidth}
          thickness={leadThickness}
          padContactLength={leadLength}
          bodyDistance={leadLength + 1}
          height={0.8}
        />
      ))}
      <ChipBody
        center={{ x: 0, y: 0, z: leadThickness / 2 }}
        width={bodyWidth - leadWidth - 1}
        length={fullLength}
        height={1.5}
      />
    </>
  );
};
