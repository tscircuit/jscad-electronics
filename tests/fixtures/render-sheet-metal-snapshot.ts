import { mp } from "@tscircuit/modelprinter"
import { createSheetMetalMesh } from "../../lib/mechanical/sheet-metal-mesh"
import { sheetMetalStrings } from "./sheet-metal-examples"
import { renderModelSnapshot } from "./render-model-snapshot"

export function renderSheetMetalSnapshot(index: 0 | 1 | 2) {
  const modelString = sheetMetalStrings[index]
  const definition = mp.string(modelString).json()
  if (definition.fn !== "sheetmetal") throw new Error("Expected sheet metal")
  const { fn, ...props } = definition
  return renderModelSnapshot({
    metalness: 1,
    roughness: 0.4,
    mesh: createSheetMetalMesh(props),
    title: `SHEET METAL / ${definition.profile.toUpperCase()}`,
    modelString,
    views: [
      {
        name: "ISOMETRIC",
        detail: "FORMED PANELS AND CUTOUTS",
        eye: [42, -55, 45],
        target: [0, 0, 5],
        span: 44,
      },
      {
        name: "TOP",
        detail: "BASE PANEL CUTOUTS",
        eye: [0, 0, 70],
        target: [0, 0, 0],
        span: 44,
      },
      {
        name: "FRONT",
        detail: "CONSTANT THICKNESS AND BEND RADII",
        eye: [0, -65, 8],
        target: [0, 0, 8],
        span: 44,
      },
      {
        name: "RIGHT",
        detail: "FLANGE PROFILE AND CUTOUTS",
        eye: [65, 0, 8],
        target: [0, 0, 8],
        span: 44,
      },
    ],
    footer:
      "POPPYGL / FOUR VIEWS / DIMENSIONS IN mm / COMPLETE MODEL FROM TITLE STRING",
  })
}
