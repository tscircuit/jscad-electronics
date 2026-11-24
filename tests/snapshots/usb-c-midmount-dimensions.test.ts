import { test } from "bun:test"
import { Footprinter3d } from "../../lib/Footprinter3d"
import { geom3ToIndexedMesh } from "../../lib/mechanical/geom3-to-indexed-mesh"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { getComponentModel } from "../helpers/component-model"

test("renders a USB-C receptacle with independently specified mechanical dimensions", async () => {
  const footprint =
    "usbcmidmount16_shelldepth7.3mm_shellwall0.30mm_cavitydepth4mm_tonguesetback0.30mm_tonguethickness0.62mm"
  const { geometries } = getComponentModel(Footprinter3d, { footprint })
  const [shell, ...parts] = geometries
  const target = [0, -1.5, 1.2] as const
  const png = await renderModelSnapshot({
    mesh: geom3ToIndexedMesh(shell!.geom),
    color: [0.72, 0.74, 0.77, 1],
    additionalMeshes: parts.map(({ geom }) => ({
      mesh: geom3ToIndexedMesh(geom),
      color: geom.color
        ? [geom.color[0], geom.color[1], geom.color[2], 1]
        : [0.72, 0.74, 0.77, 1],
    })),
    title: "USB-C MID-MOUNT RECEPTACLE",
    modelString: footprint,
    views: [
      {
        name: "ISOMETRIC",
        detail: "MATING FACE AND SHELL",
        eye: [11, -20, 11],
        target,
        span: 12,
      },
      {
        name: "TOP",
        detail: "7.30 mm SHELL DEPTH",
        eye: [0, -1.5, 24],
        target,
        span: 11,
      },
      {
        name: "FRONT",
        detail: "0.62 mm TONGUE",
        eye: [0, -24, 1.2],
        target,
        span: 10,
      },
      {
        name: "SIDE",
        detail: "SHELL AND MOUNTING TABS",
        eye: [24, -1.5, 1.2],
        target,
        span: 11,
      },
    ],
    footer:
      "CAVITY DEPTH 4.00 mm / TONGUE SETBACK 0.30 mm / SHELL WALL 0.30 mm",
  })
  await expectPngSnapshot(png, import.meta.path)
})
