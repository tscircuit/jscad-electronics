import { ExtrudedPads } from "../ExtrudedPads"
import { Footprinter3d } from "../Footprinter3d"
import { Fragment, type VNode, h } from "./h"
import { type ColoredGeom, type RenderResult, render } from "./render"
export * from "./convertCSGToThreeGeom"
export { createManifoldJscadAdapter } from "./manifold-adapter"
import type * as jscadModeling from "@jscad/modeling"

export { h, Fragment }
export type { VNode, RenderResult, ColoredGeom }

export function getJscadModelForFootprint(
  footprint: string,
  jscad: typeof jscadModeling,
): RenderResult {
  const vnode = h(Footprinter3d, { footprint })
  return render(vnode, jscad)
}

export function getJscadModelForFootprintWithPads(
  footprint: string,
  jscad: typeof jscadModeling,
): RenderResult {
  const vnode = h(
    Fragment,
    {},
    h(Footprinter3d, { footprint }),
    h(ExtrudedPads, { footprint }),
  )
  return render(vnode, jscad)
}

export function createJSCADRenderer(jscad: typeof jscadModeling) {
  function createJSCADRoot(container: ColoredGeom[]) {
    return {
      render(element: VNode) {
        const { geometries } = render(element, jscad)
        container.splice(0, container.length, ...geometries)
      },
    }
  }

  return { createJSCADRoot }
}

/**
 * Render a footprint string using manifold-3d as the geometry backend.
 * Requires a manifold adapter created via createManifoldJscadAdapter().
 *
 * Usage:
 *   const adapter = await createManifoldJscadAdapter();
 *   const result = getManifoldModelForFootprint('0402', adapter);
 */
export function getManifoldModelForFootprint(
  footprint: string,
  manifoldAdapter: any,
): RenderResult {
  const vnode = h(Footprinter3d, { footprint })
  return render(vnode, manifoldAdapter)
}
