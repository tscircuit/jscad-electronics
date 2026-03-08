import * as jscadModeling from "@jscad/modeling"
import { convertJscadModelToGltf } from "jscad-to-gltf"
import { renderGLTFToPNGBufferFromGLBBuffer } from "poppygl"
import { importVanilla } from "../fixtures/importVanilla.js"

interface RenderOptions {
  camPos?: readonly [number, number, number]
  lookAt?: readonly [number, number, number]
  showBoard?: boolean
  boardSize?: [number, number]
}

/**
 * Render a footprint to PNG using poppygl via GLTF conversion
 * This preserves colors correctly from the JSCAD model
 */
export async function renderFootprint(
  footprint: string,
  options?: RenderOptions,
): Promise<Buffer> {
  const { getJscadModelForFootprintWithPads } = await importVanilla()
  const result = getJscadModelForFootprintWithPads(footprint, jscadModeling)

  if (options?.showBoard) {
    const boardWidth = options.boardSize?.[0] ?? 12
    const boardDepth = options.boardSize?.[1] ?? 8
    const board = jscadModeling.primitives.cuboid({
      size: [boardWidth, boardDepth, 1.6],
      center: [0, 0, -0.8],
    })
    result.geometries.push({ geom: board, color: "#008800" })
  }

  // Convert JSCAD model to GLB format (preserves colors)
  // Use axisTransform to make objects lie flat (Y-up to Z-up)
  const gltfResult = await convertJscadModelToGltf(result, {
    format: "glb",
    axisTransform: "jscad_y+ -> gltf_z+",
  })

  // Render the GLB with grid settings
  const pngBuffer = await renderGLTFToPNGBufferFromGLBBuffer(
    gltfResult.data instanceof ArrayBuffer
      ? gltfResult.data
      : Buffer.from(gltfResult.data as string),
    {
      width: 800,
      height: 600,
      backgroundColor: [1, 1, 1],
      ambient: 0.3,
      gamma: true,
      cull: true,
      camPos: options?.camPos,
      lookAt: options?.lookAt,
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
