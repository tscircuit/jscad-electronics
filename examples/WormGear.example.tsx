import { WormGear } from "../lib/WormGear"
import { ComponentPreview } from "./utils/ComponentPreview"

export default {
  "Right hand / single start": (
    <ComponentPreview>
      <WormGear />
    </ComponentPreview>
  ),
  "Left hand / single start": (
    <ComponentPreview>
      <WormGear handedness="left" />
    </ComponentPreview>
  ),
  "Right hand / two starts": (
    <ComponentPreview>
      <WormGear
        module={1.25}
        pitchDiameter={12}
        length={24}
        starts={2}
        boreDiameter={4}
      />
    </ComponentPreview>
  ),
  "Left hand / three starts": (
    <ComponentPreview>
      <WormGear
        module={1.5}
        pitchDiameter={14}
        length={24}
        starts={3}
        handedness="left"
        boreDiameter={4}
        phase={30}
      />
    </ComponentPreview>
  ),
}
