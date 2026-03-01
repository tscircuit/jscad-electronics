import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import * as jscadModeling from "@jscad/modeling"
import { createJSCADRenderer } from "jscad-fiber"
import { convertJscadModelToGltf } from "jscad-to-gltf"
import { renderGLTFToPNGBufferFromGLBBuffer } from "poppygl"
import * as React from "react"
import { JSTZH1_5mm } from "../../dist/index.js"

async function renderComponent(element: React.ReactElement): Promise<Buffer> {
  const container: any[] = []
  const { createJSCADRoot } = createJSCADRenderer(jscadModeling)
  const root = createJSCADRoot(container)
  root.render(element)

  const result = { geometries: container.map((geom) => ({ geom })) }

  const gltfResult = await convertJscadModelToGltf(result, {
    format: "glb",
    axisTransform: "jscad_y+ -> gltf_z+",
  })

  const pngBuffer = await renderGLTFToPNGBufferFromGLBBuffer(
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

test("JSTZH 1.5mm component", async () => {
  const element = <JSTZH1_5mm numPins={4} />
  const pngBuffer = await renderComponent(element)
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
