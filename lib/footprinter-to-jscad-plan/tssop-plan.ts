import { jscadPlanner } from "jscad-planner"

export function createTssopPlan(fpJson: any) {
  const pinCount = fpJson.num_pins
  const pitch = fpJson.p
  const leadWidth = fpJson.pw || 0.6
  const leadLength = fpJson.pl || 1.0
  const bodyWidth = fpJson.w
  const bodyHeight = 1.2
  const leadThickness = 0.25
  
  const sidePinCount = Math.ceil(pinCount / 2)
  const fullLength = (pitch * pinCount) / 2 + leadWidth / 2
  const pinOffsetToCenter = ((sidePinCount - 1) * pitch) / 2
  
  // Chip body
  const bodyPlan = jscadPlanner.transforms.translate(
    [0, 0, bodyHeight / 2 + 0.15],
    jscadPlanner.primitives.roundedCuboid({
      size: [bodyWidth, fullLength, bodyHeight],
      roundRadius: 0.2
    })
  )
  
  // Create leads for both sides
  const leads = []
  
  // Left side leads
  for (let i = 0; i < sidePinCount; i++) {
    const leadPlan = jscadPlanner.transforms.translate(
      [-bodyWidth / 2 - leadLength, i * pitch - pinOffsetToCenter, leadThickness / 2],
      jscadPlanner.primitives.cuboid({
        size: [leadLength * 2, leadWidth, leadThickness]
      })
    )
    leads.push(leadPlan)
  }
  
  // Right side leads
  for (let i = 0; i < sidePinCount; i++) {
    const leadPlan = jscadPlanner.transforms.translate(
      [bodyWidth / 2 + leadLength, i * pitch - pinOffsetToCenter, leadThickness / 2],
      jscadPlanner.primitives.cuboid({
        size: [leadLength * 2, leadWidth, leadThickness]
      })
    )
    leads.push(leadPlan)
  }
  
  // Combine body and leads
  let plan = bodyPlan
  for (const lead of leads) {
    plan = jscadPlanner.booleans.union(plan, lead)
  }
  
  // Color the body
  plan = jscadPlanner.colors.colorize([0.33, 0.33, 0.33], plan)
  
  return plan
}