import { JsCadFixture } from "jscad-fiber"
import { BGA } from "../lib/BGA"
import { ExtrudedPads } from "../lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture zAxisUp showGrid>
      <BGA footprintString="bga32" />
      <ExtrudedPads footprint="bga32" />
    </JsCadFixture>
  )
}
