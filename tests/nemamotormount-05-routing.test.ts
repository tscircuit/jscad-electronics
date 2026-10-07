import { expect, test } from "bun:test"
import { createHash } from "node:crypto"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import {
  NemaMotorMount,
  createNemaMotorMountGeom,
} from "../lib/models/nemamotormount"
import { importVanilla } from "./fixtures/importVanilla.js"
import { getComponentModel } from "./helpers/component-model"
import examples from "../examples/nemamotormount.example"
import { nemaMotorMountStrings } from "./fixtures/nemamotormount-case"

test("nemamotormount routes both public entrypoints, excludes PCB pads and supplies direct Cosmos fixtures", async () => {
  const vanilla = await importVanilla()
  for (const nemaSize of [17, 23] as const) {
    const footprint = nemaMotorMountStrings[nemaSize]
    const model = mp.string(footprint).json()
    if (model.fn !== "nemamotormount") throw new Error("Wrong family")
    const routed = Footprinter3d({ footprint })
    expect(routed?.type).toBe(NemaMotorMount)
    const { fn, ...props } = model
    expect(routed?.props).toEqual(props)
    expect(ExtrudedPads({ footprint })).toBeNull()
    const nominal = createNemaMotorMountGeom(props)
    for (const result of [
      getComponentModel(NemaMotorMount, props),
      getComponentModel(Footprinter3d, { footprint }),
      vanilla.getJscadModelForFootprint(footprint, jscad),
      vanilla.getJscadModelForFootprintWithPads(footprint, jscad),
    ]) {
      expect(result.geometries).toHaveLength(1)
      const geom = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
      jscad.geometries.geom3.validate(geom)
      const surfaceHash = (solid: jscad.geometries.geom3.Geom3) =>
        createHash("sha256")
          .update(JSON.stringify(jscad.geometries.geom3.toPoints(solid)))
          .digest("hex")
      expect(surfaceHash(geom)).toBe(surfaceHash(nominal))
      expect(jscad.measurements.measureBoundingBox(geom)).toEqual(
        jscad.measurements.measureBoundingBox(nominal),
      )
      expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(
        jscad.measurements.measureVolume(nominal),
        6,
      )
    }
    const fixture = (nemaSize === 17 ? examples.NEMA17 : examples.NEMA23).props
      .children
    expect(fixture.type).toBe(Footprinter3d)
    expect(fixture.props.footprint).toBe(footprint)
    expect(Footprinter3d({ footprint: fixture.props.footprint })?.type).toBe(
      NemaMotorMount,
    )
  }
  expect(() =>
    Footprinter3d({ footprint: "nemamotormount_nema17_axisheight20mm" }),
  ).toThrow()
  expect(() =>
    ExtrudedPads({ footprint: "nemamotormount_nema17_shaft5mm" }),
  ).toThrow()
})
