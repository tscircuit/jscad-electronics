import { JsCadView } from "jscad-fiber";
import { ExtrudedPads, SOD723 } from "../lib";

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <SOD723 />
      <ExtrudedPads footprint="sod723" />
    </JsCadView>
  );
}
