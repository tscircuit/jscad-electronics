import { fp } from "@tscircuit/footprinter"
import { createDipPlan } from "./dip-plan"
import { createTssopPlan } from "./tssop-plan"
import { createVssopPlan } from "./vssop-plan"
import { createQfpPlan } from "./qfp-plan"
import { createQfnPlan } from "./qfn-plan"
import { createPinRowPlan } from "./pinrow-plan"
import { createCapacitorPlan } from "./capacitor-plan"
import { createSot235Plan } from "./sot235-plan"
import { createPushButtonPlan } from "./pushbutton-plan"
import { createSoicPlan } from "./soic-plan"
import { createImperialChipPlan } from "./imperial-chip-plan"

export function getJscadPlanFromFootprinterString(footprint: string) {
  const fpJson = fp.string(footprint).json() as any

  switch (fpJson.fn) {
    case "dip":
      return createDipPlan(fpJson)
    case "tssop":
      return createTssopPlan(fpJson)
    case "vssop":
      return createVssopPlan(fpJson)
    case "qfp":
      return createQfpPlan(fpJson)
    case "qfn":
      return createQfnPlan(fpJson)
    case "pinrow":
      return createPinRowPlan(fpJson)
    case "cap":
      return createCapacitorPlan(fpJson)
    case "sot235":
      return createSot235Plan(fpJson)
    case "pushbutton":
      return createPushButtonPlan(fpJson)
    case "soic":
      return createSoicPlan(fpJson)
    case "res":
    case "led":
      return createImperialChipPlan(fpJson)
  }

  // Fallback for imperial sizes
  if (fpJson.imperial) {
    return createImperialChipPlan(fpJson)
  }

  throw new Error(`Unsupported footprint: ${footprint}`)
}

export * from "./dip-plan"
export * from "./tssop-plan"
export * from "./vssop-plan"
export * from "./qfp-plan"
export * from "./qfn-plan"
export * from "./pinrow-plan"
export * from "./capacitor-plan"
export * from "./sot235-plan"
export * from "./pushbutton-plan"
export * from "./soic-plan"
export * from "./imperial-chip-plan"