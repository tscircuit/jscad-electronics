import { Cuboid } from 'jscad-fiber';

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
    <Cuboid
      center={{ x: 0, y: height / 2, z: 0 }}
      size={[bodyWidth, height, bodyLength]}
    />
  );
};

export default QFN;