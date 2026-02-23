import { JsCadView } from "jscad-fiber";
import { Screen } from "../lib/Screen";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <Screen width={32} height={24} bezelInset={3} />
    </JsCadView>
  );
};
