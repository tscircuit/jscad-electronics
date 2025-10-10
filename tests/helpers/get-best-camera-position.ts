import type { DrawCall } from "poppygl"

/**
 * Calculate optimal camera position for footprint viewing based on geometry bounds
 */
export function getBestCameraPosition(drawCalls: DrawCall[]): {
  camPos: readonly [number, number, number]
  lookAt: readonly [number, number, number]
} {
  if (drawCalls.length === 0) {
    // Default fallback for empty scenes
    return {
      camPos: [30, 30, 25] as const,
      lookAt: [0, 0, 0] as const,
    }
  }

  // Calculate bounding box from all draw calls
  let minX = Infinity
  let minY = Infinity
  let minZ = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let maxZ = -Infinity

  for (const drawCall of drawCalls) {
    const positions = drawCall.positions
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      const z = positions[i + 2]
      if (x !== undefined) {
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
      }
      if (y !== undefined) {
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
      }
      if (z !== undefined) {
        minZ = Math.min(minZ, z)
        maxZ = Math.max(maxZ, z)
      }
    }
  }

  // Calculate center and dimensions
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2
  const centerZ = (minZ + maxZ) / 2

  const width = maxX - minX
  const height = maxY - minY
  const depth = maxZ - minZ

  // Calculate camera distance based on largest dimension
  const maxDimension = Math.max(width, height, depth)

  // Use completely deterministic integer values to ensure identical rendering
  // across all environments (local, CI, different Node versions, etc.)
  const baseDistance = Math.round(maxDimension * 3)

  // Force integer camera positions for absolute consistency
  const camX = Math.round(centerX + baseDistance * 0.5)
  const camY = Math.round(centerY + baseDistance * 0.5)
  const camZ = Math.round(centerZ + baseDistance * 0.8)

  // Also round the lookAt position for consistency
  const lookAtX = Math.round(centerX * 100) / 100
  const lookAtY = Math.round(centerY * 100) / 100
  const lookAtZ = Math.round(centerZ * 100) / 100

  return {
    camPos: [camX, camY, camZ] as const,
    lookAt: [lookAtX, lookAtY, lookAtZ] as const,
  }
}
