import { expect, test } from "bun:test"
import { NemaMotor } from "../lib/NemaMotor"
import { getComponentModel } from "./helpers/component-model"

test("NEMA React rejects enum props and conflicting boolean choices before constructing geometry", () => {
  for (const props of [
    { backFace: "holes" },
    { shaftShape: "round" },
    { cornerProfile: "stepped" },
    { wireConnection: "none" },
    { wireConnection: "stubs" },
    { backFacePlain: true, backFaceHoles: true },
    { roundShaft: true, dShaft: true },
    { chamfered: true, stepped: true },
    { noWires: true, wireStubs: true },
    { noWires: true, wireConnection: "jst-ph-4" },
    { wireStubs: true, wireConnection: "jst-sh-4" },
    { backFacePlain: false },
    { dShaft: "true" },
  ])
    expect(() =>
      getComponentModel(NemaMotor, { nemaSize: 17, ...props } as Parameters<
        typeof NemaMotor
      >[0]),
    ).toThrow()
})
