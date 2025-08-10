// Custom JSX pragma that transforms existing TSX components to use jscad-planner
import { jscadPlanner } from "jscad-planner"

// Utility function to convert hex color to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [0, 0, 0]
  return [
    parseInt(result[1]!, 16) / 255,
    parseInt(result[2]!, 16) / 255,
    parseInt(result[3]!, 16) / 255,
  ]
}

// Custom JSX factory that transforms jscad-fiber Cuboids to jscad-planner operations
export function jsx(type: any, props: any): any {
  return createElement(type, props)
}

export function jsxs(type: any, props: any): any {
  return createElement(type, props)
}

export function createElement(type: any, props: any = {}, ...children: any[]): any {
  const { children: propsChildren, ...restProps } = props || {}
  const allChildren = children.length > 0 ? children : propsChildren

  // Handle Fragment
  if (type === Fragment || type?.$$typeof === Symbol.for('react.fragment')) {
    return Fragment({ children: allChildren })
  }

  // Handle jscad-fiber components - check by name/displayName
  const typeName = type?.displayName || type?.name || type
  
  if (typeName === 'Cuboid') {
    return createCuboid(restProps)
  }
  
  // Handle other jscad-fiber components with basic shapes
  if (typeof typeName === 'string') {
    switch (typeName) {
      case 'Subtract':
        return createSubtract({ children: allChildren, ...restProps })
      case 'Union':
        return createUnion({ children: allChildren, ...restProps })
      case 'RoundedCuboid':
        return createRoundedCuboid(restProps)
      case 'Polygon':
        return createPolygon(restProps)
      default:
        console.warn(`Unknown jscad-fiber component: ${typeName}`)
        return null
    }
  }

  // Handle function components - call them with props and let them use our JSX runtime
  if (typeof type === 'function') {
    return type({ ...restProps, children: allChildren })
  }

  return null
}

// Fragment implementation for planner
export function Fragment({ children }: { children?: any[] | any }) {
  if (!children) return null
  
  if (Array.isArray(children)) {
    const validShapes = children.filter(child => child != null)
    if (validShapes.length === 0) return null
    if (validShapes.length === 1) return validShapes[0]
    return jscadPlanner.booleans.union(...validShapes)
  }
  
  return children
}

// Transform jscad-fiber components to jscad-planner operations
function createCuboid(props: any) {
  const { size, offset = [0, 0, 0], color } = props
  
  let shape = jscadPlanner.primitives.cuboid({ size })
  
  if (offset[0] !== 0 || offset[1] !== 0 || offset[2] !== 0) {
    shape = jscadPlanner.transforms.translate(offset, shape)
  }
  
  if (color) {
    const rgbColor = typeof color === 'string' ? hexToRgb(color) : color
    shape = jscadPlanner.colors.colorize(rgbColor, shape)
  }
  
  return shape
}

function createSubtract(props: any) {
  const { children } = props
  if (!Array.isArray(children) || children.length < 2) return null
  
  const [base, ...toSubtract] = children.filter(Boolean)
  return jscadPlanner.booleans.subtract(base, ...toSubtract)
}

function createUnion(props: any) {
  const { children } = props
  if (!Array.isArray(children)) return children
  
  const validShapes = children.filter(Boolean)
  if (validShapes.length === 0) return null
  if (validShapes.length === 1) return validShapes[0]
  return jscadPlanner.booleans.union(...validShapes)
}

function createRoundedCuboid(props: any) {
  const { size, roundRadius = 0, offset = [0, 0, 0], color } = props
  
  // For now, approximate with regular cuboid - could be enhanced
  let shape = jscadPlanner.primitives.cuboid({ size })
  
  if (offset[0] !== 0 || offset[1] !== 0 || offset[2] !== 0) {
    shape = jscadPlanner.transforms.translate(offset, shape)
  }
  
  if (color) {
    const rgbColor = typeof color === 'string' ? hexToRgb(color) : color
    shape = jscadPlanner.colors.colorize(rgbColor, shape)
  }
  
  return shape
}

function createPolygon(props: any) {
  const { points = [], height = 0.1 } = props
  
  // Create a simple approximation with jscad-planner
  if (points.length < 3) return null
  
  // For now, create a simple cuboid as placeholder
  // This could be enhanced to create proper polygons
  const bounds = points.reduce((acc: any, point: any) => {
    acc.minX = Math.min(acc.minX, point[0])
    acc.maxX = Math.max(acc.maxX, point[0])
    acc.minY = Math.min(acc.minY, point[1])
    acc.maxY = Math.max(acc.maxY, point[1])
    return acc
  }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity })
  
  const width = bounds.maxX - bounds.minX
  const depth = bounds.maxY - bounds.minY
  const centerX = (bounds.minX + bounds.maxX) / 2
  const centerY = (bounds.minY + bounds.maxY) / 2
  
  let shape = jscadPlanner.primitives.cuboid({ size: [width, depth, height] })
  shape = jscadPlanner.transforms.translate([centerX, centerY, height / 2], shape)
  
  return shape
}

// Export all components - they will use the custom JSX runtime automatically
export * from './index'

// Export jscadPlanner for direct use
export { jscadPlanner }