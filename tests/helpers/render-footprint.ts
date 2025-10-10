import { importVanilla } from "../fixtures/importVanilla.js"
import * as jscadModeling from "@jscad/modeling"
import { convertCSGToThreeGeom } from "../../lib/vanilla/convertCSGToThreeGeom"
import {
  renderDrawCalls,
  encodePNGToBuffer,
  pureImageFactory,
  type DrawCall,
} from "poppygl"
import { mat4 } from "gl-matrix"
import { getBestCameraPosition } from "./get-best-camera-position"

/**
 * Render a footprint to PNG using poppygl
 */
export async function renderFootprint(footprint: string): Promise<Buffer> {
  const { getJscadModelForFootprint } = await importVanilla()
  const result = getJscadModelForFootprint(footprint, jscadModeling)

  // Convert JSCAD geometries to poppygl DrawCalls
  const drawCalls: DrawCall[] = []

  for (const item of result.geometries) {
    // Extract the actual geometry (it might be wrapped in a geom property)
    const geom = (item as any).geom || item
    const threeGeometry = convertCSGToThreeGeom(geom)
    if (!threeGeometry || !threeGeometry.attributes.position) continue

    const positions = new Float32Array(
      threeGeometry.attributes.position.array as Float32Array,
    )
    const indices = threeGeometry.index
      ? new Uint32Array(threeGeometry.index.array as Uint32Array)
      : null

    // Get colors if available
    let colors: Float32Array | null = null
    if (threeGeometry.attributes.color) {
      colors = new Float32Array(
        threeGeometry.attributes.color.array as Float32Array,
      )
    }

    // Get normals if available
    let normals: Float32Array | null = null
    if (threeGeometry.attributes.normal) {
      normals = new Float32Array(
        threeGeometry.attributes.normal.array as Float32Array,
      )
    }

    const drawCall: DrawCall = {
      positions,
      indices,
      colors,
      normals,
      uvs: null,
      model: mat4.create(),
      material: {
        baseColorFactor: [0.8, 0.8, 0.8, 1.0],
        baseColorTexture: null,
      },
      mode: 4, // TRIANGLES mode
    }

    drawCalls.push(drawCall)
  }

  // Calculate optimal camera position
  const { camPos, lookAt } = getBestCameraPosition(drawCalls)

  // Render using poppygl
  const { bitmap } = renderDrawCalls(
    drawCalls,
    {
      width: 800,
      height: 600,
      backgroundColor: [1, 1, 1], // White background
      ambient: 0.3,
      gamma: true,
      cull: true,
      camPos,
      lookAt,
    },
    pureImageFactory,
  )

  return encodePNGToBuffer(bitmap)
}
