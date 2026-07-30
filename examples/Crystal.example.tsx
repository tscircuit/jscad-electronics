import { JsCadView } from "jscad-fiber"
import { Crystal, ExtrudedPads } from "../lib"

export default function CrystalExample() {
  return (
    <JsCadView zAxisUp showGrid>
      <Crystal />
      <ExtrudedPads footprint="crystal4" />
    </JsCadView>
  )
}
