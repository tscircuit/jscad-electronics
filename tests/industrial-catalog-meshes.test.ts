import { expect, test } from "bun:test"
import catalog from "../docs/industrial-catalog.json"
import { assertClosedGearMesh } from "./fixtures/assert-gear-geometry"

for (const entry of catalog) {
  test(`${entry.name}: public default mesh is closed and outward oriented`, async () => {
    const model = await import(`../lib/models/${entry.name}/index.ts`)
    const factories = Object.entries(model).filter(
      ([name, value]) =>
        name.startsWith("create") &&
        name.endsWith("Mesh") &&
        typeof value === "function",
    )
    expect(factories).toHaveLength(1)
    const createMesh = factories[0]![1] as (input: Record<string, never>) => {
      positions: number[]
      indices: number[]
    }
    // Independent edge incidence, winding, degeneracy and signed-volume checks.
    expect(assertClosedGearMesh(createMesh({}))).toBeGreaterThan(0)
  }, 60000)
}
