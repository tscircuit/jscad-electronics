import * as jscad from "@jscad/modeling"
import { createJSCADRenderer } from "jscad-fiber"
import { createElement, type ComponentType, type ReactElement } from "react"
import { PNG } from "pngjs"
import type { CameraPreset } from "./camera-presets"
import { renderComponent } from "./render-component"

/** Explicit component rendering, independent of footprint-to-model selection. */
export function getComponentModel<P extends object>(
  Component: ComponentType<P>,
  props: P,
) {
  const geometries: jscad.geometries.geom3.Geom3[] = []
  const { createJSCADRoot } = createJSCADRenderer(jscad as never)
  createJSCADRoot(geometries).render(createElement(Component, props))
  return { geometries: geometries.map((geom) => ({ geom })) }
}

export async function renderComponentContactSheet(element: ReactElement) {
  const views: CameraPreset[] = [
    "top-left-corner",
    "top-down",
    "bottom-up",
    "front",
    "left-sideview",
    "top-right-corner",
  ]
  const sheet = new PNG({ width: 2400, height: 800 })
  for (const [i, cameraPreset] of views.entries()) {
    const png = PNG.sync.read(
      Buffer.from(
        await renderComponent(element, {
          width: 800,
          height: 400,
          cameraPreset,
          gridZ: 0,
        }),
      ),
    )
    PNG.bitblt(
      png,
      sheet,
      0,
      0,
      800,
      400,
      (i % 3) * 800,
      Math.floor(i / 3) * 400,
    )
  }
  return PNG.sync.write(sheet)
}
