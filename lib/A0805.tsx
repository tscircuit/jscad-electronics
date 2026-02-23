import { Cuboid } from "jscad-fiber";

const fullLength = 2.0;
const width = 1.25;
const height = 0.55;
const terminatorWidth = 0.5;

const bodyLength = fullLength - terminatorWidth * 2;

export const A0805 = ({ color = "#333" }) => {
  return (
    <>
      <Cuboid
        size={[bodyLength, width, height]}
        offset={[0, 0, height / 2]}
        color={color}
      />
      <Cuboid
        size={[terminatorWidth, width, height]}
        offset={[fullLength / 2 - terminatorWidth / 2, 0, height / 2]}
        color="#ccc"
      />
      <Cuboid
        size={[terminatorWidth, width, height]}
        offset={[-fullLength / 2 + terminatorWidth / 2, 0, height / 2]}
        color="#ccc"
      />
    </>
  );
};
