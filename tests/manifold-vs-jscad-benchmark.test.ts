import { test, expect } from "bun:test"
import { importVanilla } from "./fixtures/importVanilla.js"
import * as jscadModeling from "@jscad/modeling"
import Module from "manifold-3d"

test("benchmark manifold vs jscad rendering speed", async () => {
  const {
    getJscadModelForFootprint,
    getManifoldModelForFootprint,
    createManifoldJscadAdapter,
  } = await importVanilla()

  const wasm = await Module()
  wasm.setup()
  const adapter = createManifoldJscadAdapter(wasm)

  const footprints = ["0402", "0805", "soic8"]
  const iterations = 50

  console.log(
    `\n  Benchmark: ${iterations} iterations per footprint\n` +
      "  ─────────────────────────────────────────────────────────",
  )

  for (const fp of footprints) {
    // Warmup
    getJscadModelForFootprint(fp, jscadModeling)
    getManifoldModelForFootprint(fp, adapter)

    // Benchmark jscad
    const jscadStart = performance.now()
    for (let i = 0; i < iterations; i++) {
      getJscadModelForFootprint(fp, jscadModeling)
    }
    const jscadMs = performance.now() - jscadStart

    // Benchmark manifold
    const manifoldStart = performance.now()
    for (let i = 0; i < iterations; i++) {
      getManifoldModelForFootprint(fp, adapter)
    }
    const manifoldMs = performance.now() - manifoldStart

    const speedup = jscadMs / manifoldMs
    console.log(
      `  ${fp.padEnd(8)} jscad: ${(jscadMs / iterations).toFixed(2)}ms  manifold: ${(manifoldMs / iterations).toFixed(2)}ms  (${speedup.toFixed(1)}x ${speedup > 1 ? "faster" : "slower"})`,
    )

    // Both should produce valid output
    expect(
      getManifoldModelForFootprint(fp, adapter).geometries.length,
    ).toBeGreaterThan(0)
  }

  // Boolean-heavy benchmark: union 20 overlapping cubes
  const boolIterations = 20
  console.log(
    `\n  Boolean benchmark: union ${boolIterations} overlapping cuboids\n` +
      "  ─────────────────────────────────────────────────────────",
  )

  // jscad boolean chain
  const jscadBoolStart = performance.now()
  for (let run = 0; run < 10; run++) {
    let result = jscadModeling.primitives.cuboid({ size: [2, 2, 2] })
    for (let i = 1; i < boolIterations; i++) {
      const box = jscadModeling.transforms.translate(
        [i * 0.5, i * 0.3, i * 0.2],
        jscadModeling.primitives.cuboid({ size: [2, 2, 2] }),
      )
      result = jscadModeling.booleans.union(result, box)
    }
  }
  const jscadBoolMs = (performance.now() - jscadBoolStart) / 10

  // manifold boolean chain
  const manifoldBoolStart = performance.now()
  for (let run = 0; run < 10; run++) {
    let result = adapter.primitives.cuboid({ size: [2, 2, 2] })
    for (let i = 1; i < boolIterations; i++) {
      const box = adapter.transforms.translate(
        [i * 0.5, i * 0.3, i * 0.2],
        adapter.primitives.cuboid({ size: [2, 2, 2] }),
      )
      result = adapter.booleans.union(result, box)
    }
  }
  const manifoldBoolMs = (performance.now() - manifoldBoolStart) / 10

  const boolSpeedup = jscadBoolMs / manifoldBoolMs
  console.log(
    `  union20  jscad: ${jscadBoolMs.toFixed(2)}ms  manifold: ${manifoldBoolMs.toFixed(2)}ms  (${boolSpeedup.toFixed(1)}x ${boolSpeedup > 1 ? "faster" : "slower"})`,
  )

  console.log("")
})
