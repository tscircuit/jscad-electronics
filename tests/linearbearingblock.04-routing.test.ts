import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  LinearBearingBlock,
  createLinearBearingBlockMesh,
  createLinearBearingBlockGeom,
} from "../lib/models/linearbearingblock"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"

test("linearbearingblock public factories, synchronous dispatch and parts/materials agree without pads", async () => {
  const source =
    "linearbearingblock_bore8mm_bearingod15mm_w34mm_l24mm_h24mm_mount(clearance)_hole4.5mm_pitchx24mm_pitchy16mm"
  const definition = mp.string(source).json()
  if (definition.fn !== "linearbearingblock")
    throw new Error("Expected linearbearingblock")
  const { fn, ...props } = definition
  const mesh = createLinearBearingBlockMesh(props)
  const geometry = createLinearBearingBlockGeom(props)
  const vanilla = await importVanilla()
  expect(vanilla.createLinearBearingBlockMesh(props)).toEqual(mesh)
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  for (const result of [
    getComponentModel(LinearBearingBlock, props),
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
  const overridden = getComponentModel(LinearBearingBlock, {
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
