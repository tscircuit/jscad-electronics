import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import * as React from "react"
import * as jscadModeling from "@jscad/modeling"
import type { Geom3 } from "@jscad/modeling/src/geometries/types"
import { createJSCADRenderer } from "jscad-fiber"
import { convertJscadModelToGltf } from "jscad-to-gltf"
import { renderGLTFToPNGFromGLB } from "poppygl"
import { JSTXH2_5mm } from "../../lib/JSTXH2_5mm"
import { Footprinter3d } from "../../lib/Footprinter3d"
import { Colorize, Cuboid, Translate } from "jscad-fiber"

async function renderComponentView(
  element: React.ReactElement,
  options: {
    camPos?: [number, number, number]
    lookAt?: [number, number, number]
  } = {},
): Promise<Uint8Array> {
  const container: Geom3[] = []
  const { createJSCADRoot } = createJSCADRenderer(
    jscadModeling as unknown as Parameters<typeof createJSCADRenderer>[0],
  )
  const root = createJSCADRoot(container)
  root.render(element)

  const result = { geometries: container.map((geom) => ({ geom })) }

  const gltfResult = await convertJscadModelToGltf(result, {
    format: "glb",
    axisTransform: "jscad_y+ -> gltf_z+",
  })

  const pngBuffer = await renderGLTFToPNGFromGLB(
    gltfResult.data instanceof ArrayBuffer
      ? gltfResult.data
      : Buffer.from(gltfResult.data as string),
    {
      width: 800,
      height: 600,
      backgroundColor: [1, 1, 1],
      ambient: 0.5,
      gamma: true,
      cull: true,
      camPos: options.camPos ?? [0.001, 20, -0.05],
      lookAt: options.lookAt ?? [0, 0, 0],
      grid: {
        infiniteGrid: true,
        cellSize: 0.5,
        sectionSize: 5,
        fadeDistance: 50,
        fadeStrength: 1.5,
        gridColor: [0.9, 0.9, 0.9],
        sectionColor: [0.7, 0.7, 0.7],
      },
    },
  )

  return pngBuffer
}

test("JSTXH 2.5mm component top view", async () => {
  const element = (
    <>
      <Colorize color="#4c8c2b">
        <Translate offset={[0, 0, -0.5]}>
          <Cuboid size={[20, 20, 1]} center={[0, 0, 0]} />
        </Translate>
      </Colorize>
      <JSTXH2_5mm numPins={4} />
    </>
  )
  const pngBuffer = await renderComponentView(element, {
    camPos: [0.001, 20, -0.05],
    lookAt: [0, 0, 0],
  })
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})

test("JSTXH 2.5mm component underside left view", async () => {
  const element = <JSTXH2_5mm numPins={4} />
  const pngBuffer = await renderComponentView(element, {
    camPos: [-14, -18, 14],
    lookAt: [0, 0, 0],
  })
  await expect(pngBuffer).toMatchPngSnapshot(
    import.meta.path,
    "jstxh2_5mm-underside-left",
  )
})

test("JSTXH 2.5mm component underside right view", async () => {
  const element = <JSTXH2_5mm numPins={4} />
  const pngBuffer = await renderComponentView(element, {
    camPos: [14, -18, 14],
    lookAt: [0, 0, 0],
  })
  await expect(pngBuffer).toMatchPngSnapshot(
    import.meta.path,
    "jstxh2_5mm-underside-right",
  )
})

test("JSTXH 2.5mm component full bottom view", async () => {
  const element = <JSTXH2_5mm numPins={4} />
  const pngBuffer = await renderComponentView(element, {
    camPos: [0.001, -20, 0],
    lookAt: [0, 0, 0],
  })
  await expect(pngBuffer).toMatchPngSnapshot(
    import.meta.path,
    "jstxh2_5mm-bottom",
  )
})

test("Footprinter3d renders JST XH connector", () => {
  const result = Footprinter3d({ footprint: "jst4_xh" })
  expect(result).toBeDefined()
})

test("Footprinter3d normalizes jstxh2_5mm string", () => {
  const result = Footprinter3d({ footprint: "jstxh2_5mm4" })
  expect(result).toBeDefined()
})
