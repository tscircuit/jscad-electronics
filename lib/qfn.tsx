import { Cuboid, Colorize } from 'jscad-fiber';

export const QFN = ({
  fullWidth = 5,
  height = 0.8,
  thermalPadSize = 2  
}: {
  fullWidth?: number;
  height?: number;
  thermalPadSize?: number;
}) => {
  const bodyWidth = fullWidth;
  const bodyLength = fullWidth;
  const thermalPadHeight = 0.1;  
  return (
    <>
      <Colorize color="grey">
      <Cuboid
        center={{ x: 0, y: height / 2, z: 0 }}
        size={[bodyWidth, height, bodyLength]}
      />
      </Colorize>
      <Cuboid
        center={{ x: 0, y: -thermalPadHeight / 2, z: 0 }}
        size={[thermalPadSize, thermalPadHeight, thermalPadSize]}
      />
    </>
  );
};

export default QFN;
