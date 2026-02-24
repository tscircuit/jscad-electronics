import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"
import * as jscadModeling from "@jscad/modeling"

test("benchmark manifold vs jscad rendering speed", async () => {
  const {
    getJscadModelForFootprint,
    getManifoldModelForFootprint,
    createManifoldJscadAdapter,
  } = await importVanilla()

  const adapter = await createManifoldJscadAdapter()

  const footprints = ["0402", "0805", "soic8"]
  const iterations = 50

  console.log(
    `\n  Benchmark: ${iterations} iterations per footprint\n` +
      "  ─────────────────────────────────────────────────────────",
  )

  for (const fp of footprints) {
    getJscadModelForFootprint(fp, jscadModeling)
    getManifoldModelForFootprint(fp, adapter)

    const jscadStart = performance.now()
    for (let i = 0; i < iterations; i++) {
      getJscadModelForFootprint(fp, jscadModeling)
    }
    const jscadMs = performance.now() - jscadStart

    const manifoldStart = performance.now()
    for (let i = 0; i < iterations; i++) {
      getManifoldModelForFootprint(fp, adapter)
    }
    const manifoldMs = performance.now() - manifoldStart

    const speedup = jscadMs / manifoldMs
    console.log(
      `  ${fp.padEnd(8)} jscad: ${(jscadMs / iterations).toFixed(2)}ms  manifold: ${(manifoldMs / iterations).toFixed(2)}ms  (${speedup.toFixed(1)}x ${speedup > 1 ? "faster" : "slower"})`,
    )

    expect(
      getManifoldModelForFootprint(fp, adapter).geometries.length,
    ).toBeGreaterThan(0)
  }

  console.log("")
})
