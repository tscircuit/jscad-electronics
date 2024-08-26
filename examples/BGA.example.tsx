import { JsCadFixture, Rotate } from "jscad-fiber"
import { BGA } from "../lib/BGA"
import { ExtrudedPads } from "../src/lib/ExtrudedPads"

export default () => {
  return (
    <JsCadFixture>
      <BGA footprintString="bga32" />
      {/* <ExtrudedPads footprint="bga64" /> */}
    </JsCadFixture>
  )
}
