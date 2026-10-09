import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  ThreadedRod,
  createThreadedRodMesh,
  createThreadedRodGeom,
} from "../lib/models/threadedrod"

test("threadedrod React and built vanilla routing share geometry and exclude PCB pads", async () => {
  const source = "threadedrod_m6_l100mm_chamfer0.5mm"
  const definition = mp.string(source).json()
  if (definition.fn !== "threadedrod") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  const geometry = createThreadedRodGeom(props)
  const direct = getComponentModel(ThreadedRod, props)
  const routed = getComponentModel(Footprinter3d, { footprint: source })
  const vanilla = await importVanilla()
  const built = vanilla.getJscadModelForFootprintWithPads(source, jscad)
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  expect(typeof vanilla.createThreadedRodMesh).toBe("function")
  expect(typeof vanilla.createThreadedRodGeom).toBe("function")
  for (const result of [direct, routed, built]) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    expect(jscad.measurements.measureBoundingBox(solid)).toEqual(
      jscad.measurements.measureBoundingBox(geometry),
    )
    expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(
      jscad.measurements.measureVolume(geometry),
      6,
    )
  }
})
