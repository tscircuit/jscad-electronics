import { jscadPlanner } from "jscad-planner"

export function createSot235Plan(fpJson: any) {
  return jscadPlanner.primitives.cuboid({
    size: [2.3, 1.3, 1.1]
  })
}