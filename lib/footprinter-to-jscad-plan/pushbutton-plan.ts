import { jscadPlanner } from "jscad-planner"

export function createPushButtonPlan(fpJson: any) {
  const width = fpJson.w
  const length = fpJson.h || fpJson.w
  const height = 3.5
  
  return jscadPlanner.primitives.cuboid({
    size: [length, width, height]
  })
}