import { JsCadView } from "jscad-fiber"
import { MS013 } from "../lib/ms013"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <MS013 pinCount={16} />
      <ExtrudedPads footprint="ms013" />
    </JsCadView>
  )
}
