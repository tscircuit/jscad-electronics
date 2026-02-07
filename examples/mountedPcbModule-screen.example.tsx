import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { Footprinter3d } from "../lib/Footprinter3d"
import MountedPcbModule from "lib/MountedPcbModule"

export default () => {
  const footprint =
    "mountedpcbmodule_pinrow10_rows1_pinrowtop_width40_height24_screen"
  return (
    <JsCadView zAxisUp showGrid>
      <ExtrudedPads footprint={footprint} />
      <MountedPcbModule numPins={10}
      width={40}
      height={24}
      pinRowSide="top"
      screen
      />
    </JsCadView>
  )
}
