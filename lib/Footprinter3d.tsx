import { fp } from "@tscircuit/footprinter"

/**
 * Outputs a 3d model for any [footprinter string](https://github.com/tscircuit/footprinter)
 */
export const Footprinter3d = ({ footprint }: { footprint: string }) => {
  const fpJson = fp.string(footprint).json()
}
