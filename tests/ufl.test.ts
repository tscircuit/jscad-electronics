import { expect, test } from "bun:test"
import { spawnSync } from "node:child_process"
import * as jscad from "@jscad/modeling"
import type { BoundingBox } from "@jscad/modeling/src/measurements/types"
import { fp } from "@tscircuit/footprinter"
import { importVanilla } from "./fixtures/importVanilla.js"

test("public U.FL rendering matches its unmated outline and three PCB terminals", async () => {
  const { getJscadModelForFootprint, getJscadModelForFootprintWithPads } =
    await importVanilla()
  for (const source of [
    "ufl",
    "ufl3",
    "ufl_p3.2mm_pw2mm_signalw1.4mm_signalx-1.3mm",
  ]) {
    const { geometries } = getJscadModelForFootprint(source, jscad) as {
      geometries: { geom: jscad.geometries.geom3.Geom3 }[]
    }
    expect(geometries.length).toBeGreaterThan(0)
    const bounds = geometries.map(
      ({ geom }: { geom: jscad.geometries.geom3.Geom3 }) =>
        jscad.measurements.measureBoundingBox(geom),
    )
    const pads = fp
      .string(source)
      .circuitJson()
      .filter(
        (element) => element.type === "pcb_smtpad" && element.shape === "rect",
      )
    const overlapsPad = (
      [min, max]: BoundingBox,
      pad: (typeof pads)[number],
    ) => {
      const overlapX =
        Math.min(max[0], pad.x + pad.width / 2) -
        Math.max(min[0], pad.x - pad.width / 2)
      const overlapY =
        Math.min(max[1], pad.y + pad.height / 2) -
        Math.max(min[1], pad.y - pad.height / 2)
      return overlapX > 0 && overlapY > 0
    }
    const lowMetal = bounds.filter(
      ([min, max]) => Math.abs(min[2]) < 1e-6 && Math.abs(max[2] - 0.1) < 1e-6,
    )
    // The rear retention tab is part of the body, not a fourth solder pad.
    const terminals = lowMetal.filter((bounds) =>
      pads.some((pad) => overlapsPad(bounds, pad)),
    )
    expect(lowMetal).toHaveLength(4)
    expect(terminals).toHaveLength(3)
    expect(pads).toHaveLength(3)
    const padMinX = Math.min(...pads.map((pad) => pad.x - pad.width / 2))
    const padMaxX = Math.max(...pads.map((pad) => pad.x + pad.width / 2))
    const padMinY = Math.min(...pads.map((pad) => pad.y - pad.height / 2))
    const padMaxY = Math.max(...pads.map((pad) => pad.y + pad.height / 2))
    expect((padMinX + padMaxX) / 2).toBeCloseTo(0, 6)
    expect((padMinY + padMaxY) / 2).toBeCloseTo(0, 6)
    // Every real solder terminal must land on exactly one pad, and each pad
    // must receive one terminal. A shifted body or swapped RF terminal fails.
    const landings = pads.map((pad) =>
      terminals.filter((bounds) => overlapsPad(bounds, pad)),
    )
    expect(landings.map((landing) => landing.length)).toEqual([1, 1, 1])
    const [min, max] = jscad.measurements.measureAggregateBoundingBox(
      ...geometries.map(({ geom }) => geom),
    )
    expect(min[2]).toBeCloseTo(0, 6)
    expect(max[2]).toBeCloseTo(1.25, 6)
    const base = bounds.find(([min, max]) => Math.abs(max[2] - 0.3) < 1e-6)
    expect(base).toBeDefined()
    expect(base![1][0] - base![0][0]).toBeCloseTo(2.6, 6)
    expect(base![1][1] - base![0][1]).toBeCloseTo(2.6, 6)
    // The circular metal shell is centered on the ground-pad X axis, not
    // the off-center bounding box of the complete asymmetric land pattern.
    const shell = bounds.find(([min, max]) => Math.abs(max[2] - 1.25) < 1e-6)
    expect(shell).toBeDefined()
    expect((shell![0][0] + shell![1][0]) / 2).toBeCloseTo(pads[0]!.x, 6)
    expect((shell![0][1] + shell![1][1]) / 2).toBeCloseTo(0, 6)
    expect(shell![1][0] - shell![0][0]).toBeCloseTo(2, 6)
    expect(
      getJscadModelForFootprintWithPads(source, jscad).geometries.length,
    ).toBeGreaterThan(geometries.length)
    if (source === "ufl") {
      expect(max[0] - min[0]).toBeCloseTo(3.1, 6)
      expect(max[1] - min[1]).toBeCloseTo(3, 6)
    }
  }
  // The published vanilla entrypoint must also load in Node ESM. Bun accepts
  // named CommonJS imports that Node rejects, so an in-process test misses it.
  const node = spawnSync(
    "node",
    [
      "--input-type=module",
      "--eval",
      `import assert from "node:assert/strict";
       import jscad from "@jscad/modeling";
       import { getJscadModelForFootprint } from ${JSON.stringify(new URL("../dist/vanilla.js", import.meta.url).href)};
       const { geometries } = getJscadModelForFootprint("ufl3", jscad);
       assert.equal(geometries.length, 9);
       assert.ok(geometries.every(({ geom, color }) => geom.polygons.length > 0 && typeof color === "string"));`,
    ],
    { cwd: new URL("..", import.meta.url), encoding: "utf8" },
  )
  expect(node.status, node.stderr).toBe(0)
})
