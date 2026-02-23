import { Cuboid } from "jscad-fiber";

const fullLength = 1.0;
const width = 0.5;
const height = 0.5;
const terminatorWidth = 0.2;

const bodyLength = fullLength - terminatorWidth * 2;

export const A0402 = ({ color = "#333" }) => {
  return (
    <>
      <Cuboid
        size={[bodyLength, width, height]}
        offset={[0, 0, height / 2]}
        color={color}
      />
      <Cuboid
        size={[terminatorWidth, height, width]}
        offset={[fullLength / 2 - terminatorWidth / 2, 0, height / 2]}
        color="#ccc"
      />
      <Cuboid
        size={[terminatorWidth, height, width]}
        offset={[-fullLength / 2 + terminatorWidth / 2, 0, height / 2]}
        color="#ccc"
      />
    </>
  );
};
