import { fp } from "@tscircuit/footprinter"
import { Dip } from "./Dip"
import { Tssop } from "./Tssop"

/**
 * Outputs a 3d model for any [footprinter string](https://github.com/tscircuit/footprinter)
 */
export const Footprinter3d = ({ footprint }: { footprint: string }) => {
  const fpJson = fp.string(footprint).json()

  switch (fpJson.fn) {
    case "dip":
      return <Dip numPins={fpJson.num_pins} />
    case "tssop":
      return <Tssop pinCount={fpJson.num_pins} />
    case "soic":
      return null // TODO
    case "passive": // 0402, 0603, etc
      return null
  }
  return null
}
