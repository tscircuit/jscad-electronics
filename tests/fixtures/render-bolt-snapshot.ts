import { mp } from "@tscircuit/modelprinter"
import { createHexSocketBoltMesh } from "../../lib/mechanical/hex-socket-bolt-mesh"
import { renderModelSnapshot } from "./render-model-snapshot"

export async function renderBoltSnapshot() {
  const modelString = "hexsocketbolt_m3_l6mm"
  const definition = mp.string(modelString).json()
  if (definition.fn !== "hexsocketbolt") throw new Error("Expected bolt")
  const { fn, ...props } = definition
  const views = [
    {
      name: "ISOMETRIC",
      detail: "HEAD, SOCKET AND RIGHT-HAND THREAD",
      eye: [11, -16, 12],
      target: [0, 0, -1.4],
      span: 11.8,
    },
    {
      name: "TOP",
      detail: "2.5 mm HEX SOCKET / 5.5 mm HEAD DIAMETER",
      eye: [0, 0, 20],
      target: [0, 0, 0],
      span: 8.5,
    },
    {
      name: "FRONT",
      detail: "6 mm UNDER HEAD / 9 mm OVERALL",
      eye: [0, -20, -1.5],
      target: [0, 0, -1.5],
      span: 11.4,
    },
    {
      name: "UNDERSIDE",
      detail: "BEARING FACE, THREAD RUNOUT AND TIP",
      eye: [-12, -17, -13],
      target: [0, 0, -1.7],
      span: 11.8,
    },
  ] as const
  return renderModelSnapshot({
    metalness: 1,
    roughness: 0.25,
    mesh: createHexSocketBoltMesh(props),
    title: "M3 x 6 mm / METRIC HEX SOCKET BOLT",
    modelString,
    views,
    footer:
      "POPPYGL / FOUR ORTHOGRAPHIC VIEWS / DIMENSIONS IN mm / APPROXIMATE THREAD GEOMETRY",
  })
}
