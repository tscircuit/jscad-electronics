import { fp } from "@tscircuit/footprinter"
import { Dip } from "./DualInlinePackage"
import { Tssop } from "./Tssop"
import { A0402 } from "./A0402"
import { A0603 } from "./A0603"
import { A0805 } from "./A0805"

/**
 * Outputs a 3d model for any [footprinter string](https://github.com/tscircuit/footprinter)
 */
export const Footprinter3d = ({ footprint }: { footprint: string }) => {
  const fpJson = fp.string(footprint).json()

  switch (fpJson.fn) {
    case "dip":
      return <Dip numPins={fpJson.num_pins} />
    case "tssop":
      return <Tssop pinCount={fpJson.num_pins} fpJson={fpJson} />
    case "soic":
      return <Tssop pinCount={fpJson.num_pins} fpJson={fpJson} /> // TODO switch to SOIC
  }

  switch (fpJson.imperial) {
    case "0402":
      return <A0402 />
    case "0603":
      return <A0603 />
    case "0805":
      return <A0805 />
  }
  return null
}
