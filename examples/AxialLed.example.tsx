import { JsCadFixture, Translate, Union } from "jscad-fiber"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { AxialLed } from "../lib/AxialLed"

export default () => {
    return (
        <JsCadFixture zAxisUp showGrid>
            <AxialLed pitch={14} />
            <ExtrudedPads footprint="axial_p14mm" />
        </JsCadFixture>

    )
}