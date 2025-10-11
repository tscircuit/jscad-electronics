import { JsCadView } from "jscad-fiber"
import { A0402 } from "../lib/A0402"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      {/* Custom colors */}
      <A0402
        color="#0044cc" // blue ceramic
        terminatorColor="#d4af37" // gold
      />

      <ExtrudedPads footprint="0402" />
    </JsCadView>
  )
}
