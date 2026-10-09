import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { do219adVariants } from "../examples/fixtures/do219ad-variants"
import { sod323heVariants } from "../examples/fixtures/sod323he-variants"
import { DO219AD } from "../lib/DO219AD"
import { Footprinter3d } from "../lib/Footprinter3d"
import { SOD323HE } from "../lib/SOD323HE"
import { importVanilla } from "./fixtures/importVanilla.js"
import { getComponentModel } from "./helpers/component-model"

for (const [name, Component, variants] of [
  ["do219ad", DO219AD, do219adVariants],
  ["sod323he", SOD323HE, sod323heVariants],
] as const) {
  test(`${name} routes physical dimensions to React and built vanilla models`, async () => {
    const { getJscadModelForFootprint } = await importVanilla()
    const nominal = Object.values(variants)[0]!.props
    const cases = [
      { footprint: name, props: nominal },
      // Copper land dimensions must not resize the physical package.
      { footprint: `${name}_p4mm_pw2mm_ph2mm`, props: nominal },
      ...Object.values(variants).map(({ props }) => ({
        footprint: [
          name,
          ...Object.entries(props).map(
            ([key, value]) => `${key.toLowerCase()}${value}mm`,
          ),
        ].join("_"),
        props,
      })),
    ]

    for (const { footprint, props } of cases) {
      const expected = getComponentModel(Component, props).geometries
      const react = getComponentModel(Footprinter3d, { footprint }).geometries
      const vanilla = getJscadModelForFootprint(footprint, jscad).geometries
      expect(expected.length).toBeGreaterThan(0)
      for (const actual of [react, vanilla]) {
        expect(actual.length).toBe(expected.length)
        for (const [i, { geom }] of actual.entries()) {
          expect<unknown>(jscad.measurements.measureBoundingBox(geom)).toEqual(
            jscad.measurements.measureBoundingBox(expected[i]!.geom),
          )
          const volume = jscad.measurements.measureVolume(geom)
          expect(volume).toBeGreaterThan(0)
          expect(volume).toBeCloseTo(
            jscad.measurements.measureVolume(expected[i]!.geom),
            8,
          )
        }
      }
    }
  })
}
