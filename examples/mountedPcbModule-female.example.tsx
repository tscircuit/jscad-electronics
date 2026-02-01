import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "lib/index"
import MountedPCBModule from "lib/MountedPcbModule"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <ExtrudedPads footprint="mountedpcbmodule_pinrow20_rows2_pinrowbottom_width40_height22_female_holes(topleft,topright,bottomleft,bottomright)" />
      <MountedPCBModule
        numPins={20}
        rows={2}
        pinRowSide="bottom"
        width={40}
        height={22}
        holes={["topleft", "topright", "bottomleft", "bottomright"]}
        female
      />
    </JsCadView>
  )
}
