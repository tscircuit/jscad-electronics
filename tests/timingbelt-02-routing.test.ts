import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { createElement, isValidElement } from "react"
import { createJSCADRenderer } from "jscad-fiber"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { TimingBelt, createTimingBeltGeom } from "../lib/models/timingbelt"
import { importVanilla } from "./fixtures/importVanilla.js"
const source = "timingbelt_profile(t5)_shape(openstraight)_teeth20_w10mm"
test("timingbelt React/vanilla public factories and generated pad policy", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "timingbelt") throw new Error("Wrong family")
  const { fn, ...props } = definition
  const routed = Footprinter3d({ footprint: source })
  expect(isValidElement(routed)).toBe(true)
  expect<unknown>(routed?.type).toBe(TimingBelt)
  const solids: jscad.geometries.geom3.Geom3[] = []
  createJSCADRenderer(jscad as never)
    .createJSCADRoot(solids)
    .render(createElement(Footprinter3d, { footprint: source }))
  expect(solids).toHaveLength(1)
  const direct = createTimingBeltGeom(props),
    vanilla = await importVanilla()
  const fromVanilla = vanilla.getJscadModelForFootprint(
    source,
    jscad,
  ).geometries
  expect(fromVanilla).toHaveLength(1)
  const signature = (geom: jscad.geometries.geom3.Geom3) => ({
    bounds: jscad.measurements.measureBoundingBox(geom),
    volume: jscad.measurements.measureVolume(geom),
    polygons: jscad.geometries.geom3.toPolygons(geom).length,
  })
  expect(signature(solids[0]!)).toEqual(signature(direct))
  expect(signature(fromVanilla[0]!.geom)).toEqual(signature(direct))
  expect(signature(direct).volume).toBeGreaterThan(0)
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  expect(
    vanilla.getJscadModelForFootprintWithPads(source, jscad).geometries,
  ).toHaveLength(1)
  expect(() =>
    Footprinter3d({
      footprint: "timingbelt_profile(t5)_shape(openstraight)_teeth0_w10mm",
    }),
  ).toThrow()
  expect(() =>
    ExtrudedPads({
      footprint: "timingbelt_profile(t5)_shape(openstraight)_teeth0_w10mm",
    }),
  ).toThrow()
  expect(typeof vanilla.createTimingBeltGeom).toBe("function")
  expect(signature(vanilla.createTimingBeltGeom(props))).toEqual(
    signature(direct),
  )
})
