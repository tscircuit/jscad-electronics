import { JsCadView } from "jscad-fiber"
import { ExtrudedPads, FemaleHeaderRow } from "lib/index"
export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <ExtrudedPads footprint="pinrow5_id01mm_p2.54mm_od01.6mm" />
      <FemaleHeaderRow numberOfPins={5} legsLength={3} pitch={2.54} />
    </JsCadView>
  )
}
