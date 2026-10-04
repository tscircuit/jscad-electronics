import { getWormGearDimensions } from "@tscircuit/modelprinter"
import { HelicalGear } from "../lib/HelicalGear"
import { ComponentPreview } from "./utils/ComponentPreview"

export default {
  "24 teeth / right hand": (
    <ComponentPreview>
      <HelicalGear />
    </ComponentPreview>
  ),
  "Left hand / bore and hub": (
    <ComponentPreview>
      <HelicalGear
        toothCount={24}
        faceWidth={8}
        helixAngle={30}
        handedness="left"
        boreDiameter={5}
        hubDiameter={10}
        hubLength={3}
      />
    </ComponentPreview>
  ),
  "Zero angle / spur compatible": (
    <ComponentPreview>
      <HelicalGear helixAngle={0} boreDiameter={5} />
    </ComponentPreview>
  ),
  "Worm pitch and lead matched / layout approximation": (
    <ComponentPreview>
      <HelicalGear
        toothCount={32}
        module={1}
        helixAngle={
          getWormGearDimensions({ module: 1, pitchDiameter: 10, starts: 2 })
            .leadAngle
        }
        handedness="right"
        boreDiameter={5}
      />
    </ComponentPreview>
  ),
}
