import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  assertOpenAxialBore,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { assertIndustrialSnapshot } from "./fixtures/industrial-model-snapshot"
import {
  createFlatWasherGeom,
  createFlatWasherMesh,
} from "../lib/models/flatwasher"
import {
  createToothedWasherGeom,
  createToothedWasherMesh,
} from "../lib/models/toothedwasher"
import {
  createWaveWasherGeom,
  createWaveWasherMesh,
} from "../lib/models/wavewasher"
import {
  createBellevilleWasherGeom,
  createBellevilleWasherMesh,
} from "../lib/models/bellevillewasher"
import {
  createShoulderBoltGeom,
  createShoulderBoltMesh,
} from "../lib/models/shoulderbolt"
import { createUBoltGeom, createUBoltMesh } from "../lib/models/ubolt"
import { createEyeBoltGeom, createEyeBoltMesh } from "../lib/models/eyebolt"
import {
  createCarriageBoltGeom,
  createCarriageBoltMesh,
} from "../lib/models/carriagebolt"
import { createWingNutGeom, createWingNutMesh } from "../lib/models/wingnut"
import { createCapNutGeom, createCapNutMesh } from "../lib/models/capnut"
import {
  createCouplingNutGeom,
  createCouplingNutMesh,
} from "../lib/models/couplingnut"
import { createTSlotNutGeom, createTSlotNutMesh } from "../lib/models/tslotnut"
import { createRivetNutGeom, createRivetNutMesh } from "../lib/models/rivetnut"
import {
  createSolidRivetGeom,
  createSolidRivetMesh,
} from "../lib/models/solidrivet"
import {
  createBlindRivetGeom,
  createBlindRivetMesh,
} from "../lib/models/blindrivet"
import {
  createClevisPinGeom,
  createClevisPinMesh,
} from "../lib/models/clevispin"
import {
  createSpringPinGeom,
  createSpringPinMesh,
} from "../lib/models/springpin"
import { createTaperPinGeom, createTaperPinMesh } from "../lib/models/taperpin"
import {
  createRetainingRingGeom,
  createRetainingRingMesh,
} from "../lib/models/retainingring"
import {
  createHairpinCotterGeom,
  createHairpinCotterMesh,
} from "../lib/models/hairpincotter"
const cases = [
  {
    name: "flatwasher",
    geom: createFlatWasherGeom,
    mesh: createFlatWasherMesh,
    modelString: "flatwasher_id6.4mm_od12mm_t1.6mm",
  },
  {
    name: "toothedwasher",
    geom: createToothedWasherGeom,
    mesh: createToothedWasherMesh,
    modelString: "toothedwasher_id6.4mm_od13mm_t0.8mm_td1.5mm",
  },
  {
    name: "wavewasher",
    geom: createWaveWasherGeom,
    mesh: createWaveWasherMesh,
    modelString: "wavewasher_id10mm_od16mm_t0.6mm_wh1.5mm",
  },
  {
    name: "bellevillewasher",
    geom: createBellevilleWasherGeom,
    mesh: createBellevilleWasherMesh,
    modelString: "bellevillewasher_id6.4mm_od14mm_t0.8mm_ch1.5mm",
  },
  {
    name: "shoulderbolt",
    geom: createShoulderBoltGeom,
    mesh: createShoulderBoltMesh,
    modelString: "shoulderbolt_sd8mm_sl20mm_td6mm_tl10mm_hd13mm_hh5mm",
  },
  {
    name: "ubolt",
    geom: createUBoltGeom,
    mesh: createUBoltMesh,
    modelString: "ubolt_d6mm_s30mm_l35mm",
  },
  {
    name: "eyebolt",
    geom: createEyeBoltGeom,
    mesh: createEyeBoltMesh,
    modelString: "eyebolt_d6mm_l24mm_id14mm_wd5mm",
  },
  {
    name: "carriagebolt",
    geom: createCarriageBoltGeom,
    mesh: createCarriageBoltMesh,
    modelString: "carriagebolt_d6mm_l25mm_nw6.5mm_nh3mm_hd14mm_hh4mm",
  },
  {
    name: "wingnut",
    geom: createWingNutGeom,
    mesh: createWingNutMesh,
    modelString: "wingnut_id6mm_af10mm_h5mm_s28mm_wh10mm_wt3mm",
  },
  {
    name: "capnut",
    geom: createCapNutGeom,
    mesh: createCapNutMesh,
    modelString: "capnut_id6mm_af10mm_h5mm_ch5mm_wt1mm",
  },
  {
    name: "couplingnut",
    geom: createCouplingNutGeom,
    mesh: createCouplingNutMesh,
    modelString: "couplingnut_id6mm_af10mm_h18mm",
  },
  {
    name: "tslotnut",
    geom: createTSlotNutGeom,
    mesh: createTSlotNutMesh,
    modelString: "tslotnut_id6mm_w16mm_l20mm_bh4mm_nw10mm_nh4mm",
  },
  {
    name: "rivetnut",
    geom: createRivetNutGeom,
    mesh: createRivetNutMesh,
    modelString: "rivetnut_id6mm_d9mm_l14mm_fd12mm_ft1.5mm",
  },
  {
    name: "solidrivet",
    geom: createSolidRivetGeom,
    mesh: createSolidRivetMesh,
    modelString: "solidrivet_d4mm_l12mm_hd8mm_hh2.5mm",
  },
  {
    name: "blindrivet",
    geom: createBlindRivetGeom,
    mesh: createBlindRivetMesh,
    modelString: "blindrivet_d4mm_l10mm_fd8mm_ft1.2mm_md2mm_ml20mm",
  },
  {
    name: "clevispin",
    geom: createClevisPinGeom,
    mesh: createClevisPinMesh,
    modelString: "clevispin_d6mm_l25mm_hd10mm_hh2mm_hol2mm_ho3mm",
  },
  {
    name: "springpin",
    geom: createSpringPinGeom,
    mesh: createSpringPinMesh,
    modelString: "springpin_od6mm_l20mm_wt1mm_g1mm",
  },
  {
    name: "taperpin",
    geom: createTaperPinGeom,
    mesh: createTaperPinMesh,
    modelString: "taperpin_ld6mm_sd5mm_l30mm",
  },
  {
    name: "retainingring",
    geom: createRetainingRingGeom,
    mesh: createRetainingRingMesh,
    modelString: "retainingring_id16mm_od20mm_t1.2mm_g5mm_ld4mm_hol1.5mm",
  },
  {
    name: "hairpincotter",
    geom: createHairpinCotterGeom,
    mesh: createHairpinCotterMesh,
    modelString: "hairpincotter_d2mm_l40mm_ld10mm",
  },
]
for (const entry of cases) {
  test(`${entry.name} makes finite positive-volume geometry`, () => {
    const geom = entry.geom(),
      mesh = entry.mesh()
    expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
    expect(mesh.positions.length).toBeGreaterThan(36)
    expect(mesh.positions.every(Number.isFinite)).toBe(true)
    expect(
      mesh.indices.every(
        (index) =>
          Number.isInteger(index) &&
          index >= 0 &&
          index < mesh.positions.length / 3,
      ),
    ).toBe(true)
    const bounds = meshBounds(mesh)
    for (let i = 0; i < 3; i++)
      expect(bounds.maximum[i]! - bounds.minimum[i]!).toBeGreaterThan(0)
  })
  test(`${entry.name} standard four-view dimensional snapshot`, async () => {
    await assertIndustrialSnapshot({
      name: entry.name,
      modelString: entry.modelString,
      mesh: entry.mesh(),
    })
  }, 60000)
}
test("washers and through-bored nuts keep their center bores open", () => {
  for (const [mesh, diameter] of [
    [createFlatWasherMesh(), 6.4],
    [createToothedWasherMesh(), 6.4],
    [createWaveWasherMesh(), 10],
    [createBellevilleWasherMesh(), 6.4],
    [createWingNutMesh(), 6],
    [createCouplingNutMesh(), 6],
    [createTSlotNutMesh(), 6],
    [createRivetNutMesh(), 6],
  ] as const)
    assertOpenAxialBore(mesh, diameter / 2)
})
test("wave and conical washers have the requested axial rises", () => {
  const wave = meshBounds(createWaveWasherMesh()),
    cone = meshBounds(createBellevilleWasherMesh())
  expect(wave.minimum[2]).toBeCloseTo(0, 3)
  expect(wave.maximum[2]).toBeCloseTo(2.1, 3)
  expect(cone.maximum[2]).toBeCloseTo(2.3, 3)
  expect(cone.minimum[2]).toBeCloseTo(0, 3)
})
test("taper pin ends differ and clevis pin has a real transverse drilled hole", () => {
  const mesh = createTaperPinMesh(),
    bounds = meshBounds(mesh)
  const radiiAt = (z: number) =>
    mesh.positions.flatMap((_, i) =>
      i % 3 === 0 && Math.abs(mesh.positions[i + 2]! - z) < 1e-8
        ? [Math.hypot(mesh.positions[i]!, mesh.positions[i + 1]!)]
        : [],
    )
  expect(Math.max(...radiiAt(bounds.minimum[2]!))).toBeCloseTo(3, 3)
  expect(Math.max(...radiiAt(bounds.maximum[2]!))).toBeCloseTo(2.5, 3)
  const nominalSolid = Math.PI * 3 * 3 * 25 + Math.PI * 5 * 5 * 2
  expect(jscad.measurements.measureVolume(createClevisPinGeom())).toBeLessThan(
    nominalSolid - 10,
  )
})
test("cap nut blind bore is closed under its dome and spring pin is slotted", () => {
  const cap = createCapNutMesh(),
    slot = createSpringPinMesh()
  const roofTriangles = cap.indices.reduce(
    (n, _, i) =>
      i % 3 === 0 &&
      cap.indices
        .slice(i, i + 3)
        .every((index) => Math.abs(cap.positions[index * 3 + 2]! - 4) < 0.001)
        ? n + 1
        : n,
    0,
  )
  expect(roofTriangles).toBeGreaterThan(0)
  // The radial slot removes material at the positive-X seam throughout the pin.
  const middle = slot.positions.filter((_, i) => i % 3 === 1)
  expect(middle.some((y) => Math.abs(Math.abs(y) - 0.5) < 0.001)).toBe(true)
})
