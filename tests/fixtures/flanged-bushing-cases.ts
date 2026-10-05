import type { FlangedBushingModelPropsInput } from "@tscircuit/modelprinter"

export const source =
  "flangedbushing_id8mm_od12mm_flangeod18mm_l15mm_flangethickness2mm_style(plainclosed)"
export const examples: FlangedBushingModelPropsInput[] = [
  {
    innerDiameter: 8,
    outerDiameter: 12,
    flangeDiameter: 18,
    length: 15,
    flangeThickness: 2,
  },
  {
    innerDiameter: "0.25in",
    outerDiameter: "0.5in",
    flangeDiameter: "0.75in",
    length: "1in",
    flangeThickness: "0.125in",
  },
  {
    innerDiameter: 8,
    outerDiameter: 8.1,
    flangeDiameter: 8.2,
    length: 0.5,
    flangeThickness: 0.1,
  },
]
