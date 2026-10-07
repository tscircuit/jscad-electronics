import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { Gooseneck, createGooseneckGeom } from "../lib/models/gooseneck"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { Footprinter3d } from "../lib/Footprinter3d"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  lampGooseneckString,
  straightGooseneckString,
  smoothGooseneckString,
} from "./fixtures/gooseneck-inputs"
import { getComponentModel } from "./helpers/component-model"

for (const source of [
  lampGooseneckString,
  straightGooseneckString,
  smoothGooseneckString,
]) {
  test(`gooseneck React and built vanilla routing: ${source}`, async () => {
    const definition = mp.string(source).json()
    if (definition.fn !== "gooseneck") throw new Error("Expected gooseneck")
    const { fn, ...props } = definition
    const geometry = createGooseneckGeom(props)
    expect(
      getComponentModel(ExtrudedPads, { footprint: source }).geometries,
    ).toHaveLength(0)
    const vanilla = await importVanilla()
    expect(typeof vanilla.createGooseneckMesh).toBe("function")
    expect(typeof vanilla.Gooseneck).toBe("function")
    for (const result of [
      getComponentModel(Gooseneck, props),
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
  }, 30000)
}

test("gooseneck malformed strings fail before rendering", async () => {
  const vanilla = await importVanilla()
  for (const source of [
    "gooseneck_id6mm",
    "gooseneck_angle181",
    "gooseneck_pitch0mm",
  ]) {
    expect(() =>
      getComponentModel(Footprinter3d, { footprint: source }),
    ).toThrow()
    expect(() =>
      vanilla.getJscadModelForFootprintWithPads(source, jscad),
    ).toThrow()
  }
})
