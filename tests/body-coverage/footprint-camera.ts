import { fp } from "@tscircuit/footprinter"

type Vec3 = [number, number, number]

export type FootprintCamera = {
  camPos: Vec3
  lookAt: Vec3
  fov: number
}

/** Which side of the board to look from. */
export type FootprintView = "top" | "bottom"

/**
 * A camera derived from the FOOTPRINT and a recorded package height, not from
 * the rendered model.
 *
 * The preset cameras frame the model's own bounding box, which is exactly what
 * a before/after pair must not do: with no body the box is a few flat pads,
 * with a body it is the part, so the two images come out at different zooms
 * and angles and the diff reads as a different scene rather than a part
 * appearing. Neither input here changes when the body lands, so the viewpoint
 * is identical on both sides and the part is the only difference.
 *
 * Coordinates are glTF's (Y-up), matching the `jscad_y+ -> gltf_z+` transform
 * the render helper applies: gltf x = jscad x, gltf y = jscad z (height),
 * gltf z = -jscad y.
 */
export const cameraForFootprint = (
  footprint: string,
  packageHeightMm: number,
  view: FootprintView = "top",
): FootprintCamera => {
  const { minX, maxX, minY, maxY } = footprintPadBounds(footprint)

  const width = Math.max(maxX - minX, 0.5)
  const depth = Math.max(maxY - minY, 0.5)
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2

  // Frame a volume as tall as the package is, with a floor so a flat part is
  // not framed edge-on. Nothing here reads the model.
  const height = Math.max(packageHeightMm, Math.max(width, depth) * 0.35, 1)

  const fov = 35
  const radius = 0.5 * Math.hypot(width, depth, height)
  const distance = radius / Math.tan((fov * Math.PI) / 360) + radius * 0.2

  // The "top-left-corner" direction the preset used, kept so the new images
  // read like the rest of the suite. The underside view is the same shot
  // mirrored below the board: what a viewer cannot show, and the only way to
  // check that every lead, foot and pin lands on its pad or hole.
  const direction: Vec3 =
    view === "bottom" ? [0.7, -1.2, -0.8] : [0.7, 1.2, -0.8]
  const length = Math.hypot(...direction)
  const lookAt: Vec3 = [
    centerX,
    view === "bottom" ? -height * 0.15 : height * 0.45,
    -centerY,
  ]

  return {
    fov,
    lookAt,
    camPos: [
      lookAt[0] + (direction[0] / length) * distance,
      lookAt[1] + (direction[1] / length) * distance,
      lookAt[2] + (direction[2] / length) * distance,
    ],
  }
}

/**
 * The XY extent of everything footprinter puts on the board: pads (rect, pill
 * and polygon), plated holes, and the silkscreen outline, which for a few
 * parts (`potentiometer`, `radial`) is the only description of the body's
 * outline.
 */
export const footprintPadBounds = (footprint: string) => {
  let minX = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  const add = (x: number, y: number) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
  }

  for (const element of fp.string(footprint).circuitJson() as any[]) {
    if (element.type === "pcb_smtpad") {
      if (Array.isArray(element.points)) {
        for (const { x, y } of element.points) add(x, y)
        continue
      }
      const halfWidth = (element.width ?? 0) / 2
      const halfHeight = (element.height ?? 0) / 2
      add(element.x - halfWidth, element.y - halfHeight)
      add(element.x + halfWidth, element.y + halfHeight)
    } else if (element.type === "pcb_plated_hole") {
      const outer =
        element.outer_diameter ?? element.outer_width ?? element.radius ?? 0
      const halfWidth = outer / 2
      const halfHeight =
        (element.outer_diameter ?? element.outer_height ?? outer) / 2
      add(element.x - halfWidth, element.y - halfHeight)
      add(element.x + halfWidth, element.y + halfHeight)
    } else if (element.type === "pcb_silkscreen_path") {
      for (const { x, y } of element.route ?? []) add(x, y)
    }
  }

  if (!Number.isFinite(minX)) {
    throw new Error(
      `no pads, holes or silkscreen found for footprint '${footprint}'`,
    )
  }
  return { minX, maxX, minY, maxY }
}
