import { jscadPlanner } from "jscad-planner"

export function createDipPlan(fpJson: any) {
  const numPins = fpJson.num_pins
  const pitch = fpJson.p
  const bodyWidth = fpJson.w
  const numPinsOnEachSide = Math.floor(numPins / 2)
  const crossBodyPinWidth = bodyWidth + 1
  const heightAboveSurface = 0.5
  const DIP_PIN_HEIGHT = 5.47
  
  // Main chip body
  const bodyPlan = jscadPlanner.transforms.translate(
    [0, 0, heightAboveSurface + (DIP_PIN_HEIGHT - heightAboveSurface) / 2],
    jscadPlanner.primitives.roundedCuboid({
      size: [bodyWidth, numPinsOnEachSide * pitch + 0.5, DIP_PIN_HEIGHT - heightAboveSurface],
      roundRadius: 0.2
    })
  )
  
  // Create simplified pin legs (just the vertical parts)
  const pins = []
  for (let i = 0; i < numPins; i++) {
    const yRow = i % numPinsOnEachSide
    const xRow = (Math.floor(i / numPinsOnEachSide) - 0.5) * 2
    
    const pinPlan = jscadPlanner.transforms.translate(
      [
        (xRow * crossBodyPinWidth) / 2,
        yRow * pitch - ((numPinsOnEachSide - 1) / 2) * pitch,
        DIP_PIN_HEIGHT / 2 + heightAboveSurface
      ],
      jscadPlanner.primitives.cuboid({
        size: [0.5, 0.25, DIP_PIN_HEIGHT]
      })
    )
    pins.push(pinPlan)
  }
  
  // Combine body and pins
  let plan = bodyPlan
  for (const pin of pins) {
    plan = jscadPlanner.booleans.union(plan, pin)
  }
  
  // Color the body dark
  plan = jscadPlanner.colors.colorize([0.33, 0.33, 0.33], plan)
  
  return plan
}