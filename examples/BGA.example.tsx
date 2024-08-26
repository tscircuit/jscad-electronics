import { JsCadFixture } from "jscad-fiber"
import { BGA } from "../lib/BGA"
import { ExtrudedPads } from "../src/lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture zAxisUp>
      <BGA />
      <ExtrudedPads footprint="bga32" />
    </JsCadFixture>
  )
}
