import { JsCadView } from "jscad-fiber";
import { ExtrudedPads, SOD523 } from "../lib";

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <SOD523 />
      <ExtrudedPads footprint="sod523" />
    </JsCadView>
  );
}
