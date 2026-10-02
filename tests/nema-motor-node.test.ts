import { test } from "bun:test"
import { execFileSync } from "node:child_process"

test("built vanilla mechanical models work in Node ESM with the CJS JSCAD package", () => {
  execFileSync(
    "node",
    [
      "--input-type=module",
      "-e",
      `
    import assert from "node:assert/strict"
    import jscad from "@jscad/modeling"
    import {getJscadModelForFootprint, getJscadModelForFootprintWithPads, NEMA8, NEMA17, NEMA23, h, createJSCADRenderer} from "./dist/vanilla.js"
    for (const source of ["hexsocketbolt_m3_l6mm", "sheetmetal_channel_w28_l24_h16_t1_r2"]) {
      const result=getJscadModelForFootprintWithPads(source,jscad)
      assert.equal(result.geometries.length,1)
      assert(jscad.measurements.measureVolume(result.geometries[0].geom)>0)
    }
    for (const [name,Component] of [["nema8",NEMA8],["nema17",NEMA17],["nema23",NEMA23]]) {
      const {geometries}=getJscadModelForFootprint(name,jscad)
      assert(geometries.length>0)
      assert(geometries.every(({geom})=>jscad.measurements.measureVolume(geom)>0))
      assert.equal(getJscadModelForFootprintWithPads(name,jscad).geometries.length,geometries.length)
      const container=[]
      createJSCADRenderer(jscad).createJSCADRoot(container).render(h(Component,{}))
      assert.equal(container.length,geometries.length)
    }
  `,
    ],
    { cwd: import.meta.dir + "/..", stdio: "pipe" },
  )
})
