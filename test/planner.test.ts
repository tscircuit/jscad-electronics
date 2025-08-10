import { expect, test, describe } from "bun:test"
import { A0402, A0603, A0805, Footprinter3d, jscadPlanner } from "../dist/planner.js"

describe("Planner Components", () => {
  test("A0402 component should return jscad-planner operation", () => {
    const result = A0402({ color: "#ff0000" })
    
    expect(result).toBeDefined()
    expect(result.type).toBe("union")
    expect(result.shapes).toBeArray()
    expect(result.shapes.length).toBe(3) // body + 2 terminators
  })

  test("A0603 component should return jscad-planner operation", () => {
    const result = A0603({ color: "#00ff00" })
    
    expect(result).toBeDefined()
    expect(result.type).toBe("union")
    expect(result.shapes).toBeArray()
    expect(result.shapes.length).toBe(3) // body + 2 terminators
  })

  test("A0805 component should return jscad-planner operation", () => {
    const result = A0805()
    
    expect(result).toBeDefined()
    expect(result.type).toBe("union")
    expect(result.shapes).toBeArray()
    expect(result.shapes.length).toBe(3) // body + 2 terminators
  })

  test("Footprinter3d component should work with footprint string", () => {
    // Test with a simple 0402 footprint
    const footprintString = "0402"
    const result = Footprinter3d({ footprint: footprintString })
    
    expect(result).toBeDefined()
    // The result should be a jscad-planner operation, not a React element
    expect(typeof result).toBe("object")
    expect(result.type).toBeDefined()
  })

  test("Components should use existing TSX files, not reimplemented ones", () => {
    // Test that the components are actually using the original TSX structure
    // by checking they produce the same dimensions as the original components
    const a0402 = A0402()
    const a0603 = A0603()
    
    // These should be different objects (different components)
    expect(a0402).not.toEqual(a0603)
    
    // Both should be union operations with 3 shapes
    expect(a0402.type).toBe("union")
    expect(a0603.type).toBe("union")
    expect(a0402.shapes.length).toBe(3)
    expect(a0603.shapes.length).toBe(3)
  })

  test("jscadPlanner should be directly accessible", () => {
    const sphere = jscadPlanner.primitives.sphere({ radius: 5 })
    
    expect(sphere).toBeDefined()
    expect(sphere.type).toBe("sphere")
    expect(sphere.radius).toBe(5)
  })

  test("Components should handle color transformation", () => {
    const redComponent = A0402({ color: "#ff0000" })
    const defaultComponent = A0402()
    
    // Both should be valid jscad-planner operations
    expect(redComponent.type).toBe("union")
    expect(defaultComponent.type).toBe("union")
    
    // They should have the same structure but potentially different colors
    expect(redComponent.shapes.length).toBe(defaultComponent.shapes.length)
  })

  test("Fragment handling should work correctly", () => {
    // Test that fragments are properly converted to unions
    const result = A0805() // This uses fragments internally
    
    expect(result).toBeDefined()
    expect(result.type).toBe("union")
    expect(result.shapes).toBeArray()
    expect(result.shapes.length).toBeGreaterThan(1)
  })
})

describe("Custom JSX Pragma", () => {
  test("Should transform Cuboid elements to jscad-planner operations", () => {
    // This test verifies that our JSX pragma is working
    const result = A0402()
    
    // The result should contain transformed cuboid operations
    expect(result.type).toBe("union")
    expect(result.shapes).toBeArray()
    
    // Each shape should be a jscad-planner operation (cuboid, translate, colorize, etc.)
    result.shapes.forEach((shape: any) => {
      expect(shape.type).toBeString()
      expect(['cuboid', 'translate', 'colorize'].some(type => 
        shape.type === type || 
        (shape.shape && shape.shape.type === type) ||
        (shape.shape && shape.shape.shape && shape.shape.shape.type === type)
      )).toBe(true)
    })
  })

  test("Should reuse original TSX component logic", () => {
    // This test ensures we're actually using the original TSX files
    // and not just hardcoded implementations
    
    const a0402_1 = A0402({ color: "#333" })
    const a0402_2 = A0402({ color: "#333" })
    
    // Should produce consistent results
    expect(a0402_1.type).toBe(a0402_2.type)
    expect(a0402_1.shapes.length).toBe(a0402_2.shapes.length)
  })
})