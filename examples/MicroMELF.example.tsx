import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "lib/index"
import { MicroMELF } from "lib/MicroMELF"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <ExtrudedPads footprint="micromelf" />
      <MicroMELF />
    </JsCadView>
  )
}
