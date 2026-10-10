import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { fp } from "@tscircuit/footprinter"
import { FemaleHeaderRow } from "../lib/FemaleHeaderRow"
import { PinRow } from "../lib/PinRow"
import { importVanilla } from "./fixtures/importVanilla.js"

const round = (value: number) => Math.round(value * 1e6) / 1e6
const pointKey = (x: number, y: number) => `${round(x)},${round(y)}`

// Compare the rendered pin/socket centers with the actual plated holes, rather
// than another renderer. Both header families must honor independent X/Y pitch.
for (const family of ["pinrow", "headermodule"]) {
  for (const gender of ["male", "female"]) {
    for (const layout of [
      "16_rows2_cols8_p2.54mm_py22.86mm",
      "12_rows3_cols4_p2.54mm_py5mm",
      "12_rows3_cols4_p3mm",
      "8_p2.54mm",
    ]) {
      const footprint = `${family}${layout}_${gender}_id1mm_od1.8mm`
      test(`${footprint} model centers match its plated holes`, async () => {
        const { getJscadModelForFootprint } = await importVanilla()
        const holes = fp
          .string(footprint)
          .circuitJson()
          .filter((element) => element.type === "pcb_plated_hole")
        const { geometries } = getJscadModelForFootprint(footprint, jscad)
        expect(holes.length).toBeGreaterThan(0)
        expect(geometries.length).toBeGreaterThan(0)

        const holeCenters = new Set(
          holes.map((hole) => pointKey(hole.x, hole.y)),
        )
        const modelCenters = new Set(
          geometries.map(({ geom }: { geom: jscad.geometries.geom3.Geom3 }) => {
            const [min, max] = jscad.measurements.measureBoundingBox(geom)
            return pointKey((min[0] + max[0]) / 2, (min[1] + max[1]) / 2)
          }),
        )
        expect([...modelCenters].sort()).toEqual([...holeCenters].sort())
      })
    }
  }
}

for (const component of [PinRow, FemaleHeaderRow]) {
  test(`${component.name} retains the direct component's default row pitch`, () => {
    const element = component({ numberOfPins: 4, rows: 2, pitch: 3 })
    expect(element.props.children.map((child: any) => child.props.y)).toEqual([
      1.27, 1.27, -1.27, -1.27,
    ])
  })
}
