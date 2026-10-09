import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp, type SpacerModelPropsInput } from "@tscircuit/modelprinter"
import {
  Spacer,
  createSpacerGeom,
  createSpacerMesh,
} from "../lib/models/spacer"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"

const source = "spacer_id3.2mm_od6mm_l10mm_round_chamfer0.3mm"
test("spacer routes identically through React and built vanilla without implicit pads", async () => {
  const model = mp.string(source).json()
  if (model.fn !== "spacer") throw new Error("Expected spacer")
  const { fn, ...props } = model
  const vanilla = await importVanilla()
  const geometry = createSpacerGeom(props)
  expect(vanilla.createSpacerMesh(props)).toEqual(createSpacerMesh(props))
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(Spacer, props),
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
      6,
    )
  }
})
test("spacer geometry and routing use the contract's validation", () => {
  for (const invalid of [
    { outerDiameter: 3.2 },
    { length: "10mmjunk" },
    { chamfer: 0.7 },
    { round: false },
    { unexpected: 1 },
  ])
    expect(() =>
      createSpacerMesh({
        innerDiameter: 3.2,
        outerDiameter: 6,
        length: 10,
        ...invalid,
      } as SpacerModelPropsInput),
    ).toThrow()
  expect(() => Footprinter3d({ footprint: source + "_id4mm" })).toThrow()
  expect(() =>
    ExtrudedPads({ footprint: "spacer_id3.2mm_od3.2mm_l10mm" }),
  ).toThrow()
})
