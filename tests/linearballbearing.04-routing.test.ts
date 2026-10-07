import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  LinearBallBearing,
  createLinearBallBearingMesh,
  createLinearBallBearingGeom,
} from "../lib/models/linearballbearing"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"

test("linearballbearing public factories, synchronous dispatch and parts/materials agree without pads", async () => {
  const source = "linearballbearing_bore8mm_od15mm_l24mm_seals(both)"
  const definition = mp.string(source).json()
  if (definition.fn !== "linearballbearing")
    throw new Error("Expected linearballbearing")
  const { fn, ...props } = definition
  const mesh = createLinearBallBearingMesh(props)
  const geometry = createLinearBallBearingGeom(props)
  const vanilla = await importVanilla()
  expect(vanilla.createLinearBallBearingMesh(props)).toEqual(mesh)
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(LinearBallBearing, props),
    getComponentModel(Footprinter3d, { footprint: source }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
  ]) {
    expect(result.geometries).toHaveLength(mesh.parts.length)
    const solids: jscad.geometries.geom3.Geom3[] = result.geometries.map(
      (item: { geom: unknown }) => item.geom as jscad.geometries.geom3.Geom3,
    )
    for (const solid of solids) jscad.geometries.geom3.validate(solid)
    expect(jscad.measurements.measureAggregateBoundingBox(...solids)).toEqual(
      jscad.measurements.measureBoundingBox(geometry),
    )
    expect(
      solids.reduce(
        (sum, solid) => sum + jscad.measurements.measureVolume(solid),
        0,
      ),
    ).toBeCloseTo(jscad.measurements.measureVolume(geometry), 6)
    // React applies RGBA to the solid; vanilla deliberately keeps authored
    // color on its ColoredGeom wrapper. Both public representations are exact.
    const colored = result.geometries as {
      geom: jscad.geometries.geom3.Geom3
      color?: string | number[]
    }[]
    for (const [index, item] of colored.entries()) {
      const color = item.color ?? item.geom.color
      const authored = mesh.parts[index]!.color
      if (typeof color === "string") expect(color).toBe(authored)
      else {
        const rgba = [1, 3, 5].map(
          (offset) =>
            Number.parseInt(authored.slice(offset, offset + 2), 16) / 255,
        )
        expect(color).toEqual([...rgba, 1])
      }
    }
    expect(result).not.toBeInstanceOf(Promise)
  }
  const overridden = getComponentModel(LinearBallBearing, {
    ...props,
    color: "#123456",
  })
  expect(overridden.geometries).toHaveLength(mesh.parts.length)
  for (const { geom } of overridden.geometries)
    expect(geom.color).toEqual([18 / 255, 52 / 255, 86 / 255, 1])
  expect(() =>
    getComponentModel(Footprinter3d, { footprint: source + "_typo1" }),
  ).toThrow()
})
