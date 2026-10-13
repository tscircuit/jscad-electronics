import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { importVanilla } from "./fixtures/importVanilla.js"
import type { ComponentType } from "react"
import { FlatWasher, createFlatWasherGeom } from "../lib/models/flatwasher"
import {
  ToothedWasher,
  createToothedWasherGeom,
} from "../lib/models/toothedwasher"
import { WaveWasher, createWaveWasherGeom } from "../lib/models/wavewasher"
import {
  BellevilleWasher,
  createBellevilleWasherGeom,
} from "../lib/models/bellevillewasher"
import {
  ShoulderBolt,
  createShoulderBoltGeom,
} from "../lib/models/shoulderbolt"
import { UBolt, createUBoltGeom } from "../lib/models/ubolt"
import { EyeBolt, createEyeBoltGeom } from "../lib/models/eyebolt"
import {
  CarriageBolt,
  createCarriageBoltGeom,
} from "../lib/models/carriagebolt"
import { WingNut, createWingNutGeom } from "../lib/models/wingnut"
import { CapNut, createCapNutGeom } from "../lib/models/capnut"
import { CouplingNut, createCouplingNutGeom } from "../lib/models/couplingnut"
import { TSlotNut, createTSlotNutGeom } from "../lib/models/tslotnut"
import { RivetNut, createRivetNutGeom } from "../lib/models/rivetnut"
import { SolidRivet, createSolidRivetGeom } from "../lib/models/solidrivet"
import { BlindRivet, createBlindRivetGeom } from "../lib/models/blindrivet"
import { ClevisPin, createClevisPinGeom } from "../lib/models/clevispin"
import { SpringPin, createSpringPinGeom } from "../lib/models/springpin"
import { TaperPin, createTaperPinGeom } from "../lib/models/taperpin"
import {
  RetainingRing,
  createRetainingRingGeom,
} from "../lib/models/retainingring"
import {
  HairpinCotter,
  createHairpinCotterGeom,
} from "../lib/models/hairpincotter"
const cases = [
  {
    name: "flatwasher",
    Component: FlatWasher,
    geom: createFlatWasherGeom,
    modelString: "flatwasher_id6.4mm_od12mm_t1.6mm",
  },
  {
    name: "toothedwasher",
    Component: ToothedWasher,
    geom: createToothedWasherGeom,
    modelString: "toothedwasher_id6.4mm_od13mm_t0.8mm_td1.5mm",
  },
  {
    name: "wavewasher",
    Component: WaveWasher,
    geom: createWaveWasherGeom,
    modelString: "wavewasher_id10mm_od16mm_t0.6mm_wh1.5mm",
  },
  {
    name: "bellevillewasher",
    Component: BellevilleWasher,
    geom: createBellevilleWasherGeom,
    modelString: "bellevillewasher_id6.4mm_od14mm_t0.8mm_ch1.5mm",
  },
  {
    name: "shoulderbolt",
    Component: ShoulderBolt,
    geom: createShoulderBoltGeom,
    modelString: "shoulderbolt_sd8mm_sl20mm_td6mm_tl10mm_hd13mm_hh5mm",
  },
  {
    name: "ubolt",
    Component: UBolt,
    geom: createUBoltGeom,
    modelString: "ubolt_d6mm_s30mm_l35mm",
  },
  {
    name: "eyebolt",
    Component: EyeBolt,
    geom: createEyeBoltGeom,
    modelString: "eyebolt_d6mm_l24mm_id14mm_wd5mm",
  },
  {
    name: "carriagebolt",
    Component: CarriageBolt,
    geom: createCarriageBoltGeom,
    modelString: "carriagebolt_d6mm_l25mm_nw6.5mm_nh3mm_hd14mm_hh4mm",
  },
  {
    name: "wingnut",
    Component: WingNut,
    geom: createWingNutGeom,
    modelString: "wingnut_id6mm_af10mm_h5mm_s28mm_wh10mm_wt3mm",
  },
  {
    name: "capnut",
    Component: CapNut,
    geom: createCapNutGeom,
    modelString: "capnut_id6mm_af10mm_h5mm_ch5mm_wt1mm",
  },
  {
    name: "couplingnut",
    Component: CouplingNut,
    geom: createCouplingNutGeom,
    modelString: "couplingnut_id6mm_af10mm_h18mm",
  },
  {
    name: "tslotnut",
    Component: TSlotNut,
    geom: createTSlotNutGeom,
    modelString: "tslotnut_id6mm_w16mm_l20mm_bh4mm_nw10mm_nh4mm",
  },
  {
    name: "rivetnut",
    Component: RivetNut,
    geom: createRivetNutGeom,
    modelString: "rivetnut_id6mm_d9mm_l14mm_fd12mm_ft1.5mm",
  },
  {
    name: "solidrivet",
    Component: SolidRivet,
    geom: createSolidRivetGeom,
    modelString: "solidrivet_d4mm_l12mm_hd8mm_hh2.5mm",
  },
  {
    name: "blindrivet",
    Component: BlindRivet,
    geom: createBlindRivetGeom,
    modelString: "blindrivet_d4mm_l10mm_fd8mm_ft1.2mm_md2mm_ml20mm",
  },
  {
    name: "clevispin",
    Component: ClevisPin,
    geom: createClevisPinGeom,
    modelString: "clevispin_d6mm_l25mm_hd10mm_hh2mm_hol2mm_ho3mm",
  },
  {
    name: "springpin",
    Component: SpringPin,
    geom: createSpringPinGeom,
    modelString: "springpin_od6mm_l20mm_wt1mm_g1mm",
  },
  {
    name: "taperpin",
    Component: TaperPin,
    geom: createTaperPinGeom,
    modelString: "taperpin_ld6mm_sd5mm_l30mm",
  },
  {
    name: "retainingring",
    Component: RetainingRing,
    geom: createRetainingRingGeom,
    modelString: "retainingring_id16mm_od20mm_t1.2mm_g5mm_ld4mm_hol1.5mm",
  },
  {
    name: "hairpincotter",
    Component: HairpinCotter,
    geom: createHairpinCotterGeom,
    modelString: "hairpincotter_d2mm_l40mm_ld10mm",
  },
]
for (const entry of cases)
  test(`${entry.name} routes identically through its component, React model string and built vanilla`, async () => {
    const vanilla = await importVanilla()
    const expected = jscad.measurements.measureVolume(entry.geom())
    expect(ExtrudedPads({ footprint: entry.modelString })).toBeNull()
    for (const scene of [
      getComponentModel(entry.Component as ComponentType<object>, {}),
      getComponentModel(Footprinter3d, { footprint: entry.modelString }),
      vanilla.getJscadModelForFootprintWithPads(entry.modelString, jscad),
    ]) {
      expect(scene.geometries).toHaveLength(1)
      expect(
        jscad.measurements.measureVolume(scene.geometries[0]!.geom),
      ).toBeCloseTo(expected, 5)
      expect<unknown>(
        jscad.measurements.measureBoundingBox(scene.geometries[0]!.geom),
      ).toEqual(jscad.measurements.measureBoundingBox(entry.geom()))
    }
    expect(() =>
      Footprinter3d({ footprint: entry.modelString + "_typo1mm" }),
    ).toThrow()
  }, 60000)
