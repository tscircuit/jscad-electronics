import { jscadPlanner } from "jscad-planner"

export function createQfnPlan(fpJson: any) {
  const bodyWidth = fpJson.w
  const bodyLength = fpJson.h || fpJson.w
  const bodyHeight = 0.9
  
  return jscadPlanner.primitives.cuboid({
    size: [bodyLength, bodyWidth, bodyHeight]
  })
}