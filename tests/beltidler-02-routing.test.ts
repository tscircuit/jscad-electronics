import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { createElement, isValidElement } from "react"
import { createJSCADRenderer } from "jscad-fiber"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { BeltIdler, createBeltIdlerGeom } from "../lib/models/beltidler"
import { importVanilla } from "./fixtures/importVanilla.js"
const source =
  "beltidler_shape(smooth)_od20mm_bore5mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm"
test("beltidler React/vanilla public factories and generated pad policy", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "beltidler") throw new Error("Wrong family")
  const { fn, ...props } = definition
  const routed = Footprinter3d({ footprint: source })
  expect(isValidElement(routed)).toBe(true)
  expect<unknown>(routed?.type).toBe(BeltIdler)
  const solids: jscad.geometries.geom3.Geom3[] = []
  createJSCADRenderer(jscad as never)
    .createJSCADRoot(solids)
    .render(createElement(Footprinter3d, { footprint: source }))
  expect(solids).toHaveLength(1)
  const direct = createBeltIdlerGeom(props),
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
      footprint:
        "beltidler_shape(smooth)_od20mm_bore999mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm",
    }),
  ).toThrow()
  expect(() =>
    ExtrudedPads({
      footprint:
        "beltidler_shape(smooth)_od20mm_bore999mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm",
    }),
  ).toThrow()
  expect(typeof vanilla.createBeltIdlerGeom).toBe("function")
  expect(signature(vanilla.createBeltIdlerGeom(props))).toEqual(
    signature(direct),
  )
})
