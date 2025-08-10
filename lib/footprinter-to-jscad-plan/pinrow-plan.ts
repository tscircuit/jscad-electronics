import { jscadPlanner } from "jscad-planner"

export function createPinRowPlan(fpJson: any) {
  const headerLength = (fpJson.num_pins - 1) * fpJson.p + 2.54
  const headerWidth = 2.54
  const headerHeight = fpJson.male ? 8.5 : 6.0
  
  return jscadPlanner.primitives.cuboid({
    size: [headerLength, headerWidth, headerHeight]
  })
}