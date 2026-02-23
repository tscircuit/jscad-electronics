import { JsCadView } from "jscad-fiber";
import { PushButton } from "lib/PushButton";
import { ExtrudedPads } from "../lib/ExtrudedPads";
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <PushButton width={4.5} length={6.5} innerDiameter={1} />
      <ExtrudedPads footprint="pushbutton" />
    </JsCadView>
  );
};
