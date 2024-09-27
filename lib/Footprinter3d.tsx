import { fp } from "@tscircuit/footprinter"
import { Dip } from "./DIP"
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
  }
  return null
}
