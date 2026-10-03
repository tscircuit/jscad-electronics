import { SpurGear } from "../lib/SpurGear"
import { ComponentPreview } from "./utils/ComponentPreview"

export default {
  "24 teeth / module 1": (
    <ComponentPreview>
      <SpurGear />
    </ComponentPreview>
  ),
  "20 teeth / bore and hub": (
    <ComponentPreview>
      <SpurGear
        toothCount={20}
        module={1.25}
        faceWidth={6}
        boreDiameter={5}
        hubDiameter={12}
        hubLength={4}
      />
    </ComponentPreview>
  ),
  "40 teeth / fine pitch": (
    <ComponentPreview>
      <SpurGear toothCount={40} module={0.5} faceWidth={3} boreDiameter={3} />
    </ComponentPreview>
  ),
  "16 teeth / coarse pitch": (
    <ComponentPreview>
      <SpurGear
        toothCount={16}
        module={2}
        faceWidth={8}
        pressureAngle={25}
        backlash={0.15}
        boreDiameter={8}
        phase={11.25}
      />
    </ComponentPreview>
  ),
}
