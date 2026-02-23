import { ExtrudedPads } from "../lib/ExtrudedPads";
import { JsCadView } from "jscad-fiber";
import { SMB } from "../lib/SMB";

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <SMB />
      <ExtrudedPads footprint="smb" />
    </JsCadView>
  );
};
