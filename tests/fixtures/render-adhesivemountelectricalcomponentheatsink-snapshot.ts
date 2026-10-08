import { mp } from "@tscircuit/modelprinter"
import { createAdhesiveMountElectricalComponentHeatsinkMesh } from "../../lib/models/adhesivemountelectricalcomponentheatsink"
import { meshBounds } from "./assert-gear-geometry"
import { renderModelSnapshot } from "./render-model-snapshot"
export function renderAdhesiveMountElectricalComponentHeatsinkSnapshot(
  modelString: string,
) {
  const definition = mp.string(modelString).json()
  if (definition.fn !== "adhesivemountelectricalcomponentheatsink")
    throw new Error("Expected adhesivemountelectricalcomponentheatsink")
  const { fn, ...props } = definition
  const mesh = createAdhesiveMountElectricalComponentHeatsinkMesh(props)
  const { minimum, maximum } = meshBounds(mesh)
  const target = minimum.map((v, i) => (v + maximum[i]!) / 2) as [
    number,
    number,
    number,
  ]
  const span = Math.max(...maximum.map((v, i) => v - minimum[i]!)) * 1.85
  const [x, y, z] = target,
    distance = span * 5
  return renderModelSnapshot({
    mesh,
    modelString,
    title: "ADHESIVE-MOUNT ELECTRICAL COMPONENT HEATSINK",
    views: [
      {
        name: "ISOMETRIC",
        detail: "ONE CONTINUOUS EXTRUSION",
        eye: [x + distance, y - distance, z + distance],
        target,
        span,
      },
      {
        name: "TOP",
        detail: "PARALLEL FINS ALONG Y",
        eye: [x, y, z + distance],
        target,
        span,
      },
      {
        name: "FRONT",
        detail: "ADHESIVE BONDING FACE Z=0",
        eye: [x, y - distance, z],
        target,
        span,
      },
      {
        name: "SIDE",
        detail: "TOTAL HEIGHT INCLUDES BASE",
        eye: [x + distance, y, z],
        target,
        span,
      },
    ],
    footer: "HEATSINK BODY ONLY / ADHESIVE LAYER SEPARATE / DIMENSIONS IN mm",
  })
}
