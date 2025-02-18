import { FemaleHeader } from "lib/FemaleHeader";
import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "lib/index"
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <ExtrudedPads footprint="pinrow5_id01mm_p2.54mm_od01.6mm" />
      <FemaleHeader numberOfPins={5} legsLength={3} pitch={2.54} />
    </JsCadView>
  )
}
