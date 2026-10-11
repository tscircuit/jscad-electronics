import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { NemaMotor } from "../lib/NemaMotor"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import { createNemaMotorSections } from "../lib/utils/nemaMotorGeometry"
import { resolveNemaMotorProps } from "../lib/utils/nemaMotorParameters"

test("NEMA boolean variants route the same geometry through React and vanilla", async () => {
  const vanilla = await importVanilla()
  for (const variant of [
    {
      props: {
        nemaSize: 17 as const,
        backFacePlain: true,
        roundShaft: true,
        chamfered: true,
        noWires: true,
      },
      source: "nema17_plainbackface_round_chamfered_nowires",
    },
    {
      props: {
        nemaSize: 34 as const,
        backFaceHoles: true,
        dShaft: true,
        stepped: true,
        wireStubs: true,
      },
      source: "nema34_backfaceholes_dshaft_stepped_wirestubs",
    },
    {
      props: {
        nemaSize: 34 as const,
        backFaceScrews: true,
        roundShaft: true,
        chamfered: true,
        wireConnection: "jst-sh-4",
      },
      source: "nema34_backfacescrews_roundshaft_chamfered_jstsh4",
    },
  ]) {
    const direct = getComponentModel(NemaMotor, variant.props)
    const routed = vanilla.getJscadModelForFootprint(variant.source, jscad)
    const withPads = vanilla.getJscadModelForFootprintWithPads(
      variant.source,
      jscad,
    )
    expect(routed.geometries.length).toBe(direct.geometries.length)
    expect(withPads.geometries.length).toBe(routed.geometries.length)
    const bounds = (geometries: { geom: jscad.geometries.geom3.Geom3 }[]) =>
      jscad.measurements.measureAggregateBoundingBox(
        ...geometries.map(({ geom }) => geom),
      )
    expect(bounds(routed.geometries)).toEqual(bounds(direct.geometries))
    expect(bounds(withPads.geometries)).toEqual(bounds(routed.geometries))
    for (let i = 0; i < direct.geometries.length; i++) {
      const directVolume = jscad.measurements.measureVolume(
        direct.geometries[i]!.geom,
      )
      expect(directVolume).toBeGreaterThan(0)
      expect(
        jscad.measurements.measureVolume(routed.geometries[i]!.geom),
      ).toBeCloseTo(directVolume, 6)
    }
  }
  const stepped = createNemaMotorSections({ nemaSize: 34, stepped: true })
  const chamfered = createNemaMotorSections({ nemaSize: 34, chamfered: true })
  expect(stepped.find(({ name }) => name === "body")!.outline).not.toEqual(
    chamfered.find(({ name }) => name === "body")!.outline,
  )
  expect(
    resolveNemaMotorProps({ nemaSize: 17, noWires: true }),
  ).not.toHaveProperty("wireConnection")
})
