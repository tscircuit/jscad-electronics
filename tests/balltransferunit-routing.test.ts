import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  BallTransferUnit,
  createBallTransferUnitGeom,
  createBallTransferUnitMesh,
} from "../lib/models/balltransferunit"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  ballTransferUnitString,
  ballTransferUnitRoadmapString,
} from "./fixtures/balltransferunit-inputs"

test("balltransferunit routes through React and built vanilla with two metal parts and no pads", async () => {
  const vanilla = await importVanilla()
  for (const source of [
    ballTransferUnitString,
    ballTransferUnitRoadmapString,
  ]) {
    const definition = mp.string(source).json()
    if (definition.fn !== "balltransferunit") throw new Error("Wrong family")
    const { fn, ...props } = definition
    const mesh = createBallTransferUnitMesh(props)
    const geometry = createBallTransferUnitGeom(props)
    expect(vanilla.createBallTransferUnitMesh(props)).toEqual(mesh)
    expect(typeof vanilla.BallTransferUnit).toBe("function")
    expect(ExtrudedPads({ footprint: source })).toBeNull()
    for (const result of [
      getComponentModel(BallTransferUnit, props),
      getComponentModel(Footprinter3d, { footprint: source }),
      vanilla.getJscadModelForFootprintWithPads(source, jscad),
    ]) {
      expect(result.geometries).toHaveLength(2)
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
      expect(result).not.toBeInstanceOf(Promise)
      for (const [index, item] of result.geometries.entries()) {
        const authored = mesh.parts[index]!.color
        const color = item.color ?? item.geom.color
        if (typeof color === "string") expect(color).toBe(authored)
        else
          expect(color).toEqual([
            ...[1, 3, 5].map(
              (offset) =>
                Number.parseInt(authored.slice(offset, offset + 2), 16) / 255,
            ),
            1,
          ])
      }
    }
  }
  const overridden = getComponentModel(BallTransferUnit, { color: "#123456" })
  for (const { geom } of overridden.geometries)
    expect(geom.color).toEqual([18 / 255, 52 / 255, 86 / 255, 1])
  expect(() =>
    getComponentModel(Footprinter3d, {
      footprint: "balltransferunit_holed0mm",
    }),
  ).toThrow()
})
