import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { createJSCADRenderer } from "jscad-fiber"
import { Footprinter3d } from "../lib/Footprinter3d"
import { importVanilla } from "./fixtures/importVanilla.js"
import { render } from "../lib/vanilla/render"
import { h } from "../lib/vanilla/h"
import {
  Colorize,
  Cuboid,
  Translate,
  Rotate,
  Subtract,
  ExtrudeLinear,
  Polygon,
} from "../lib/vanilla/primitives"
import { convertJscadModelToGltf } from "./helpers/convert-model-to-gltf"

test.each(["soic8", "dip8", "qfp32", "pinrow6", "usbcmidmount16", "nema17"])(
  "%s exports matching React and vanilla material settings",
  async (footprint) => {
    const vanilla = await importVanilla()
    const model = vanilla.getJscadModelForFootprint(footprint, jscad)
    const react: any[] = []
    createJSCADRenderer(jscad as any)
      .createJSCADRoot(react)
      .render(<Footprinter3d footprint={footprint} />)
    expect(model.geometries.length).toBe(react.length)
    const settings = (material: any) =>
      material ? [material.metalness, material.roughness] : null
    expect(
      model.geometries.map((entry: any) => settings(entry.material)),
    ).toEqual(react.map((geom) => settings(geom.material)))
    expect(
      model.geometries.some((entry: any) => entry.material?.metalness === 1),
    ).toBe(true)
    expect(
      model.geometries.some((entry: any) => entry.material?.metalness === 0),
    ).toBe(true)
    const result = await convertJscadModelToGltf(model, { format: "gltf" })
    const gltf = JSON.parse(result.data as string)
    expect(
      gltf.materials.some(
        (material: any) => material.pbrMetallicRoughness.metallicFactor === 1,
      ),
    ).toBe(true)
  },
)

test("vanilla transforms, subtraction, and extrusion preserve explicit material metadata", () => {
  const material = { metalness: 1, roughness: 0.3 }
  const styled = h(
    Colorize,
    { color: "red", material },
    h(Cuboid, { size: [2, 2, 2] }),
  )
  const root = h(
    Translate,
    { x: 4 },
    h(
      Rotate,
      { z: 0.2 },
      h(Subtract, {}, styled, h(Cuboid, { size: [1, 1, 3] })),
    ),
  )
  const entry = render(root, jscad).geometries[0]!
  expect(entry.material).toEqual(material)
  expect(entry.geom.material).toEqual(material)
  const extruded = render(
    h(
      ExtrudeLinear,
      { height: 2 },
      h(
        Colorize,
        { material },
        h(Polygon, {
          points: [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
          ],
        }),
      ),
    ),
    jscad,
  ).geometries[0]!
  expect(extruded.material).toEqual(material)
})
