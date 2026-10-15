import { test } from "bun:test"
import { createJawCouplingMesh } from "../../lib/models/jawcoupling"
import { createBeamCouplingMesh } from "../../lib/models/beamcoupling"
import { createOldhamCouplingMesh } from "../../lib/models/oldhamcoupling"
import { createUniversalJointMesh } from "../../lib/models/universaljoint"
import { createBevelGearMesh } from "../../lib/models/bevelgear"
import { assertIndustrialSnapshot } from "../fixtures/industrial-model-snapshot"
for (const { name, modelString, create } of [
  {
    name: "jawcoupling",
    modelString: "jawcoupling_od30mm_l40mm_bore8mm_hubl12mm_jawd12mm_jawcount3",
    create: createJawCouplingMesh,
  },
  {
    name: "beamcoupling",
    modelString:
      "beamcoupling_od25mm_l30mm_bore8mm_hubl7mm_slotw1mm_slots6_bridgeangle60",
    create: createBeamCouplingMesh,
  },
  {
    name: "oldhamcoupling",
    modelString:
      "oldhamcoupling_od30mm_l36mm_bore8mm_hubl12mm_slotw7mm_slotd3mm_clearance0.2mm",
    create: createOldhamCouplingMesh,
  },
  {
    name: "universaljoint",
    modelString:
      "universaljoint_od30mm_l60mm_bore8mm_hubl14mm_armt5mm_crossd6mm_clearance0.2mm",
    create: createUniversalJointMesh,
  },
  {
    name: "bevelgear",
    modelString:
      "bevelgear_od40mm_td24mm_h14mm_bore8mm_depth3mm_hubd20mm_hubh8mm_teeth16",
    create: createBevelGearMesh,
  },
])
  test(`${name} standard four-view snapshot`, async () => {
    await assertIndustrialSnapshot({ name, modelString, mesh: create({}) })
  }, 60000)
