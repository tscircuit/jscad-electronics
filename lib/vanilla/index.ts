import { Footprinter3d } from "../Footprinter3d"
import { h, Fragment, type VNode } from "./h"
import { render, type RenderResult, type ColoredGeom } from "./render"

export { h, Fragment }
export type { VNode, RenderResult, ColoredGeom }

export function getJscadModelForFootprint(footprint: string): RenderResult {
  const vnode = h(Footprinter3d, { footprint })
  return render(vnode)
}

export function createJSCADRenderer(_jscad: any) {
  function createJSCADRoot(container: ColoredGeom[]) {
    return {
      render(element: VNode) {
        const { geometries } = render(element)
        container.splice(0, container.length, ...geometries)
      },
    }
  }

  return { createJSCADRoot }
}
