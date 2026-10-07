import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  TorsionSpring,
  createTorsionSpringGeom,
} from "../lib/models/torsionspring"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { Footprinter3d } from "../lib/Footprinter3d"
import { importVanilla } from "./fixtures/importVanilla.js"
import { getComponentModel } from "./helpers/component-model"
import { rightString, leftString } from "./fixtures/torsionspring-inputs"
for (const source of [rightString, leftString]) {
  test(`torsionspring React / vanilla routing: ${source}`, async () => {
    const definition = mp.string(source).json()
    if (definition.fn !== "torsionspring")
      throw new Error("Expected torsionspring")
    const { fn, ...props } = definition
    const geom = createTorsionSpringGeom(props),
      vanilla = await importVanilla()
    expect(typeof vanilla.TorsionSpring).toBe("function")
    expect(typeof vanilla.createTorsionSpringMesh).toBe("function")
    expect(
      getComponentModel(ExtrudedPads, { footprint: source }).geometries,
    ).toHaveLength(0)
    for (const result of [
      getComponentModel(TorsionSpring, props),
      getComponentModel(Footprinter3d, { footprint: source }),
      vanilla.getJscadModelForFootprintWithPads(source, jscad),
    ]) {
      expect(result.geometries).toHaveLength(1)
      const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
      jscad.geometries.geom3.validate(solid)
      expect(jscad.measurements.measureBoundingBox(solid)).toEqual(
        jscad.measurements.measureBoundingBox(geom),
      )
      expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(
        jscad.measurements.measureVolume(geom),
        7,
      )
    }
  }, 30000)
}
test("torsionspring invalid contract fails before rendering", async () => {
  const vanilla = await importVanilla()
  for (const source of [
    "torsionspring_pitch0mm",
    "torsionspring_left_right",
    "torsionspring_turns0",
  ]) {
    expect(() =>
      getComponentModel(Footprinter3d, { footprint: source }),
    ).toThrow()
    expect(() =>
      vanilla.getJscadModelForFootprintWithPads(source, jscad),
    ).toThrow()
  }
})
