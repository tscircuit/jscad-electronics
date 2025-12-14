import { TO92S } from "lib/index"
import { JsCadView } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <TO92S />
      <ExtrudedPads footprint="to92s" />
    </JsCadView>
  )
}
