import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "lib/index"
import MountedPCBModule from "lib/mountedpcbmodule"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <ExtrudedPads footprint="mountedpcbmodule_pinrow40_rows2_pinrowbottom_width65_height30.5_holes(topleft,topright,bottomleft,bottomright)" />
      <MountedPCBModule
        numPins={40}
        rows={2}
        pinRowSide="bottom"
        width={65}
        height={30.5}
        holes={["topleft", "topright", "bottomleft", "bottomright"]}
      />
    </JsCadView>
  )
}
