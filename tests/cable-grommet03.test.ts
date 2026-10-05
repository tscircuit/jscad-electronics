import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { CableGrommet, createCableGrommetGeom } from "../lib/CableGrommet"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { Footprinter3d } from "../lib/Footprinter3d"
import { importVanilla } from "./fixtures/importVanilla.js"
import { source } from "./fixtures/cable-grommet-inputs"
import { getComponentModel } from "./helpers/component-model"

test("grommet React, footprint routing, built vanilla and pad exclusion agree", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "cablegrommet") throw new Error("Expected grommet")
  const { fn, ...props } = definition
  const geometry = createCableGrommetGeom(props)
  expect(
    getComponentModel(ExtrudedPads, { footprint: source }).geometries,
  ).toHaveLength(0)
  const vanilla = await importVanilla()
  expect(typeof vanilla.createCableGrommetMesh).toBe("function")
  expect(typeof vanilla.CableGrommet).toBe("function")
  for (const result of [
    getComponentModel(CableGrommet, props),
    getComponentModel(Footprinter3d, { footprint: source }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
  ]) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    jscad.geometries.geom3.validate(solid)
    expect(jscad.measurements.measureBoundingBox(solid)).toEqual(
      jscad.measurements.measureBoundingBox(geometry),
    )
    expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(
      jscad.measurements.measureVolume(geometry),
      7,
    )
  }
})
