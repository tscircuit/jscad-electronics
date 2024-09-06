import { ChipBody } from "./ChipBody";

export const QFN = ({
  fullWidth = 5,
  height = 0.8
}: {
  fullWidth?: number;
  height?: number;
}) => {
  const bodyWidth = fullWidth ;
  const bodyLength = fullWidth ;

  return (
    <ChipBody
      center={{ x: 0, y: height / 2, z: 0 }}
      width={bodyWidth}
      length={bodyLength}
      height={height}
    />
  );
};

export default QFN;