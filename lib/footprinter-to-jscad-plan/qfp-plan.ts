import { jscadPlanner } from "jscad-planner"

export function createQfpPlan(fpJson: any) {
  const bodySize = fpJson.w
  const bodyHeight = 1.6
  
  return jscadPlanner.primitives.cuboid({
    size: [bodySize, bodySize, bodyHeight]
  })
}