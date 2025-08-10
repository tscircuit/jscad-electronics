import { jscadPlanner } from "jscad-planner"

export function createImperialChipPlan(fpJson: any, color?: string) {
  const dimensions = getImperialDimensions(fpJson.imperial!)
  
  // Match A0402.tsx structure - body + 2 terminators
  const fullLength = dimensions.length
  const width = dimensions.width
  const height = dimensions.height
  const terminatorWidth = 0.2
  const bodyLength = fullLength - terminatorWidth * 2
  
  // Main body
  let bodyPlan = jscadPlanner.primitives.cuboid({
    size: [bodyLength, width, height]
  })
  
  // Left terminator
  const leftTerminator = jscadPlanner.transforms.translate(
    [-(fullLength / 2 - terminatorWidth / 2), 0, 0],
    jscadPlanner.primitives.cuboid({
      size: [terminatorWidth, height, width]
    })
  )
  
  // Right terminator
  const rightTerminator = jscadPlanner.transforms.translate(
    [fullLength / 2 - terminatorWidth / 2, 0, 0],
    jscadPlanner.primitives.cuboid({
      size: [terminatorWidth, height, width]
    })
  )
  
  // Combine all parts
  let plan = jscadPlanner.booleans.union(bodyPlan, leftTerminator, rightTerminator)
  
  if (color) {
    const rgbColor = hexToRgb(color)
    plan = jscadPlanner.colors.colorize(rgbColor, plan)
  }
  
  return plan
}

function getImperialDimensions(imperial: string) {
  const dims: Record<string, { length: number; width: number; height: number }> = {
    "01005": { length: 0.4, width: 0.2, height: 0.13 },
    "0201": { length: 0.6, width: 0.3, height: 0.23 },
    "0402": { length: 1.0, width: 0.5, height: 0.35 },
    "0603": { length: 1.6, width: 0.8, height: 0.45 },
    "0805": { length: 2.0, width: 1.25, height: 0.5 },
    "1206": { length: 3.2, width: 1.6, height: 0.6 },
    "1210": { length: 3.2, width: 2.5, height: 0.6 },
    "2010": { length: 5.0, width: 2.5, height: 0.6 },
    "2512": { length: 6.4, width: 3.2, height: 0.6 }
  }
  
  return dims[imperial] || { length: 1.0, width: 0.5, height: 0.35 }
}

function hexToRgb(hex: string): [number, number, number] {
  if (!hex) return [0.5, 0.5, 0.5]
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [0.5, 0.5, 0.5]
  
  return [
    parseInt(result[1]!, 16) / 255,
    parseInt(result[2]!, 16) / 255,
    parseInt(result[3]!, 16) / 255
  ]
}