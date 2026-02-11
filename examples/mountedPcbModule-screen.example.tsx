import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { Footprinter3d } from "../lib/Footprinter3d"
import MountedPcbModule from "lib/MountedPcbModule"

export default () => {
  const footprint =
    "mountedpcbmodule_pinrow10_rows1_pinrowbottom_width50_height30_screen_screenwidth20_screenheight15_screencenteroffsetx-10_screencenteroffsety-3"
  return (
    <JsCadView zAxisUp showGrid>
      <ExtrudedPads footprint={footprint} />
      <MountedPcbModule
        numPins={10}
        pinRowSide="bottom"
        width={50}
        height={30}
        screen
        screenWidth={20}
        screenHeight={15}
        screenCenterOffsetX={0}
        screenCenterOffsetY={4}
      />
    </JsCadView>
  )
}
