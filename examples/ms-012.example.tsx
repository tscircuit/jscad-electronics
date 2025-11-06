import { JsCadView } from "jscad-fiber"
import { MS012 } from "../lib/ms-012"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <MS012 pinCount={8} />
      <ExtrudedPads footprint="ms012" />
    </JsCadView>
  )
}
