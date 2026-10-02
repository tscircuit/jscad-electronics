import { mp, type SheetMetalModelPropsInput } from "@tscircuit/modelprinter"

export const sheetMetalStrings = [
  "sheetmetal_plate_w24mm_l28mm_t1mm_r1mm_hole1(d3.2mm_bottomface_leftofcenter9mm_belowcenter7mm)_hole2(d3.2mm_bottomface_rightofcenter9mm_abovecenter7mm)_slot1(l12mm_w3mm_bottomface_vertical)",
  "sheetmetal_angle_w24mm_l20mm_h16mm_t1.2mm_r2mm_hole1(d3.2mm_bottomface_belowcenter7mm)_hole2(d3.2mm_bottomface_abovecenter7mm)_slot1(l12mm_w3mm_angledface_horizontal)",
  "sheetmetal_channel_w28mm_l24mm_h14mm_t1mm_r2mm_hole1(d3.2mm_bottomface_leftofcenter8mm_belowcenter9mm)_hole2(d3.2mm_bottomface_rightofcenter8mm_abovecenter9mm)_slot1(l18mm_w4mm_leftface_abovecenter2mm)_slot2(l18mm_w4mm_rightface_abovecenter2mm)",
] as const

export const sheetMetalExamples: SheetMetalModelPropsInput[] =
  sheetMetalStrings.map((modelString) => {
    const definition = mp.string(modelString).json()
    if (definition.fn !== "sheetmetal") throw new Error("Expected sheet metal")
    const { fn, ...props } = definition
    return props
  })
