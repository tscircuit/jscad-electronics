import { parseNemaMotorString } from "../../lib/utils/nemaMotorParameters"
import { createElement } from "react"
import { Footprinter3d } from "../../lib/Footprinter3d"
import { renderComponent } from "../helpers/render-component"
import { createAnnotatedViewSheet } from "./annotated-view-sheet"

export async function renderNemaMotor(footprint: string) {
  const p = parseNemaMotorString(footprint)
  const center = (p.shaftLength - p.bodyLength) / 2
  const distance = Math.max(p.bodyWidth, p.bodyLength + p.shaftLength) * 2.1
  // GLTF is Y-up after converting from JSCAD's Z-up coordinates.
  const cameras: {
    label: string
    camPos: [number, number, number]
    lookAt: [number, number, number]
  }[] = [
    {
      label: "ISOMETRIC",
      camPos: [distance * 0.7, center + distance * 0.55, distance * 0.7],
      lookAt: [0, center, 0],
    },
    {
      label: "MOUNTING FACE",
      camPos: [0, p.bodyWidth * 2.1, p.bodyWidth * 0.25],
      lookAt: [0, 0, 0],
    },
    { label: "FRONT", camPos: [0, center, distance], lookAt: [0, center, 0] },
    {
      label: p.shaftShape === "d" ? "SIDE / SHAFT FLAT" : "SIDE / ROUND SHAFT",
      camPos: [distance, center, 0],
      lookAt: [0, center, 0],
    },
  ]
  const views = []
  for (const { label, camPos, lookAt } of cameras)
    views.push({
      png: await renderComponent(createElement(Footprinter3d, { footprint }), {
        width: 700,
        height: 500,
        camPos,
        lookAt,
        showGrid: false,
      }),
      annotation: `${footprint}\n${label}`,
    })
  return createAnnotatedViewSheet(views, {
    columns: 2,
    fontSize: 23,
    annotationHeight: 80,
  })
}
