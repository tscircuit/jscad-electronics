import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  HollowPositioningArmTube,
  createHollowPositioningArmTubeGeom,
} from "../lib/models/hollowpositioningarmtube"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { Footprinter3d } from "../lib/Footprinter3d"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  lampHollowPositioningArmTubeString,
  straightHollowPositioningArmTubeString,
  smoothHollowPositioningArmTubeString,
} from "./fixtures/hollowpositioningarmtube-inputs"
import { getComponentModel } from "./helpers/component-model"

for (const source of [
  lampHollowPositioningArmTubeString,
  straightHollowPositioningArmTubeString,
  smoothHollowPositioningArmTubeString,
]) {
  test(`hollowpositioningarmtube React and built vanilla routing: ${source}`, async () => {
    const definition = mp.string(source).json()
    if (definition.fn !== "hollowpositioningarmtube")
      throw new Error("Expected hollowpositioningarmtube")
    const { fn, ...props } = definition
    const geometry = createHollowPositioningArmTubeGeom(props)
    expect(
      getComponentModel(ExtrudedPads, { footprint: source }).geometries,
    ).toHaveLength(0)
    const vanilla = await importVanilla()
    expect(typeof vanilla.createHollowPositioningArmTubeMesh).toBe("function")
    expect(typeof vanilla.HollowPositioningArmTube).toBe("function")
    for (const result of [
      getComponentModel(HollowPositioningArmTube, props),
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

test("hollowpositioningarmtube malformed strings fail before rendering", async () => {
  const vanilla = await importVanilla()
  for (const source of [
    "hollowpositioningarmtube_id6mm",
    "hollowpositioningarmtube_angle181",
    "hollowpositioningarmtube_pitch0mm",
  ]) {
    expect(() =>
      getComponentModel(Footprinter3d, { footprint: source }),
    ).toThrow()
    expect(() =>
      vanilla.getJscadModelForFootprintWithPads(source, jscad),
    ).toThrow()
  }
})
