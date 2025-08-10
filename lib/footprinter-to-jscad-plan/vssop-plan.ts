import { jscadPlanner } from "jscad-planner"

export function createVssopPlan(fpJson: any) {
  const bodyLength = (fpJson.num_pins / 2 - 1) * fpJson.p + (fpJson.pw || 0.6)
  const bodyWidth = fpJson.w
  const bodyHeight = fpJson.h || 1.0
  
  return jscadPlanner.primitives.cuboid({
    size: [bodyLength, bodyWidth, bodyHeight]
  })
}