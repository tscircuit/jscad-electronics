import type { PlainBushingModelPropsInput } from "@tscircuit/modelprinter"

export const source =
  "plainbushing_id8mm_od12mm_l20mm_style(plainclosed)_edgechamfer0.5mm"
export const examples: PlainBushingModelPropsInput[] = [
  { innerDiameter: 8, outerDiameter: 12, length: 20, edgeChamfer: 0.5 },
  { innerDiameter: "0.25in", outerDiameter: "0.5in", length: "1in" },
  { innerDiameter: 8, outerDiameter: 8.1, length: 0.5, edgeChamfer: 0.02 },
]
