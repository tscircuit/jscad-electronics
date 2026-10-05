import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  CompressionSpring,
  createCompressionSpringGeom,
} from "../lib/CompressionSpring"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { Footprinter3d } from "../lib/Footprinter3d"
import { importVanilla } from "./fixtures/importVanilla.js"
import { source } from "./fixtures/compression-spring-inputs"
import { getComponentModel } from "./helpers/component-model"

test("compression spring direct React, routing and built vanilla agree without pads", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "compressionspring") throw new Error("Expected spring")
  const { fn, ...props } = definition
  const geometry = createCompressionSpringGeom(props)
  const vanilla = await importVanilla()
  expect(typeof vanilla.createCompressionSpringMesh).toBe("function")
  expect(typeof vanilla.CompressionSpring).toBe("function")
  expect(
    getComponentModel(ExtrudedPads, { footprint: source }).geometries,
  ).toHaveLength(0)
  for (const result of [
    getComponentModel(CompressionSpring, props),
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
