import { Footprinter3d } from "../Footprinter3d"
import { h, Fragment, type VNode } from "./h"
import { render, type RenderResult, type ColoredGeom } from "./render"
export * from "./convertCSGToThreeGeom"
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
