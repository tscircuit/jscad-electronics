import { test, expect } from "bun:test"
import jscad from "@jscad/modeling"
import {
  PcbEdgeSupport,
  createPcbEdgeSupportGeom,
  createPcbEdgeSupportMesh,
} from "../lib/models/pcbedgesupport"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { props, modelString } from "./fixtures/pcbedgesupport-case"
test("pcbedgesupport supports React, registered strings and built vanilla without copper pads", async () => {
  const vanilla = await importVanilla()
  expect(vanilla.createPcbEdgeSupportMesh(props)).toEqual(
    createPcbEdgeSupportMesh(props),
  )
  expect(ExtrudedPads({ footprint: modelString })).toBeNull()
  const expected = jscad.measurements.measureVolume(
    createPcbEdgeSupportGeom(props),
  )
  for (const result of [
    getComponentModel(PcbEdgeSupport, props),
    getComponentModel(Footprinter3d, { footprint: modelString }),
    vanilla.getJscadModelForFootprintWithPads(modelString, jscad),
  ]) {
    expect(result.geometries.length).toBeGreaterThan(0)
    const volume = result.geometries.reduce(
      (sum: number, g: { geom: unknown }) =>
        sum +
        jscad.measurements.measureVolume(
          g.geom as jscad.geometries.geom3.Geom3,
        ),
      0,
    )
    expect(volume).toBeCloseTo(expected, 5)
  }
  expect(() => Footprinter3d({ footprint: modelString + "_typo1mm" })).toThrow()
})
