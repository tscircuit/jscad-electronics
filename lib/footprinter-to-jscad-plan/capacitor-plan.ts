import { jscadPlanner } from "jscad-planner"
import { createImperialChipPlan } from "./imperial-chip-plan"

export function createCapacitorPlan(fpJson: any) {
  return createImperialChipPlan(fpJson, "#856c4d")
}