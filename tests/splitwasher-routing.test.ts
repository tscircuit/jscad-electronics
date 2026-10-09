import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { createSplitWasherGeom, SplitWasher } from "../lib/models/splitwasher"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { importVanilla } from "./fixtures/importVanilla.js"
import { getComponentModel } from "./helpers/component-model"
const source =
  "splitwasher_id6.1mm_od11.8mm_t1.6mm_rise1.6mm_gapangle10deg_rectangular_righthanded"
test("split washer factories, React and vanilla dispatch agree without pads", async () => {
  const p = mp.string(source).json()
  if (p.fn !== "splitwasher") throw new Error("Expected split washer")
  const { fn, ...props } = p,
    vanilla = await importVanilla(),
    direct = createSplitWasherGeom(props)
  expect(typeof vanilla.SplitWasher).toBe("function")
  expect(typeof vanilla.createSplitWasherMesh).toBe("function")
  expect(
    getComponentModel(ExtrudedPads, { footprint: source }).geometries,
  ).toHaveLength(0)
  for (const result of [
    getComponentModel(SplitWasher, props),
    getComponentModel(Footprinter3d, { footprint: source }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
  ]) {
    expect(result.geometries).toHaveLength(1)
    const geom = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureBoundingBox(geom)).toEqual(
      jscad.measurements.measureBoundingBox(direct),
    )
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(
      jscad.measurements.measureVolume(direct),
      9,
    )
  }
})
